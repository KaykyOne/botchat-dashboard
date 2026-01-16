import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    WASocket,
    proto,
    downloadContentFromMessage
} from '@whiskeysockets/baileys'
import fs from 'fs'
import useMensagem from '../../funcs/useMensagem'
import useBot from '../../funcs/useBot'
import { pegarVicioAleatorio } from '../../funcs/config'
import QrCodeTerminal from 'qrcode-terminal'
import {
    juntarMensagens,
    testTentativasDeReconexao,
    timeouts,
    mensagensPendentes,
    TEMPO_ESPERA
} from '../bot'

const clients = new Map<number, WASocket>()
const qrCodes: Record<number, string> = {}

async function baixarAudio(msg: any, caminho: string) {
    if (!msg.message?.audioMessage && !msg.message?.ptt) return null

    const stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.ptt, 'audio')
    const buffer: Buffer[] = []

    for await (const chunk of stream) {
        buffer.push(chunk)
    }

    const arquivo = Buffer.concat(buffer)
    fs.writeFileSync(caminho, arquivo)
    return arquivo
}

async function startBot(usuario_id: number) {
    if (clients.has(usuario_id)) {
        console.log(`Bot do usuário ${usuario_id} já está rodando`)
        return
    }

    console.log(`Iniciando bot para o usuário ${usuario_id}`)

    const { state, saveCreds } = await useMultiFileAuthState(
        `./src/bots/baileys/sessions/bot-baileys-${usuario_id}`
    )

    const funcoes = useMensagem()
    const botFuncs = useBot()

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    })

    clients.set(usuario_id, sock)
    sock.ev.on('creds.update', saveCreds)

    let tentativasDeReconexao = 0

    // ------------------
    // CONEXÃO / QR / STATUS
    // ------------------

    sock.ev.on('connection.update', async update => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            qrCodes[usuario_id] = qr
            await funcoes.atualizarQrCode(qr, usuario_id)
            console.log(`QR code do usuário ${usuario_id}`)
            QrCodeTerminal.generate(qr, { small: true })
        }

        if (connection === 'open') {
            console.log(`✅ Bot do usuário ${usuario_id} está online`)
            funcoes.atualizarConecao(usuario_id, 'ONLINE')
            tentativasDeReconexao = 0
        }

        if (connection === 'close') {
            const statusCode = (lastDisconnect?.error as any)?.output?.statusCode

            const shouldReconnect =
                statusCode !== DisconnectReason.loggedOut

            console.log(`❌ Bot do usuário ${usuario_id} desconectado`, statusCode)

            testTentativasDeReconexao(++tentativasDeReconexao)

            clients.delete(usuario_id)

            if (shouldReconnect) {
                setTimeout(() => startBot(usuario_id), 5000)
            } else {
                console.log(`⚠️ Sessão inválida, precisa novo QR: ${usuario_id}`)
            }
        }
    })

    // ------------------
    // MENSAGENS
    // ------------------

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return
        console.log(type);

        const msg = messages[0]
        if (!msg.message) return
        if (msg.key.fromMe) return
        if (msg.key.remoteJid?.endsWith('@g.us')) return
        const numero = msg.key.remoteJid!
        const me = sock.user?.id
        if (numero == me) return;

        if (numero.includes("5517997437646")) return;

        let texto = "";

        if (msg.message.conversation || msg.message.extendedTextMessage?.text) {
            texto = msg.message.conversation ||
                msg.message.extendedTextMessage?.text || ''
        } else if (msg.message?.audioMessage) {
            const path = `./src/bots/baileys/audios/${numero}.ogg`
            await baixarAudio(msg, path);
            texto = await botFuncs.converterAudioEmTexto(path) || "";
            console.log(texto);
        }

        const timestamp = Number(msg.messageTimestamp)
        const agora = Math.floor(Date.now() / 1000)
        if (agora - timestamp > 10) return

        try {
            const res = await funcoes.testMensagem(msg, numero, sock)
            if (!res) return

            juntarMensagens(numero, texto)

            timeouts[numero] = setTimeout(async () => {
                const mensagens = mensagensPendentes[numero]
                delete mensagensPendentes[numero]
                delete timeouts[numero]

                const resposta = await botFuncs.responderPergunta(
                    mensagens,
                    numero,
                    usuario_id,
                    sock
                )

                if (!resposta) return

                const partes = resposta.includes('(SEPARAR)')
                    ? resposta.split('(SEPARAR)')
                    : [resposta]

                // await sock.sendMessage(numero, { text: `*BOT IDEALZINHO:*\n${pegarVicioAleatorio()}` })
                for (const p of partes) {
                    sock.sendPresenceUpdate('composing', numero);
                    await new Promise(r => setTimeout(r, 4000))
                    await sock.sendMessage(numero, {
                        text: `*BOT IDEALZINHO:*\n${p}`
                    })
                    sock.sendPresenceUpdate('paused', numero);
                    await new Promise(r => setTimeout(r, 20000))
                }

            }, TEMPO_ESPERA)
        } catch (err) {
            console.error(err)
        }
    })
}

export { startBot }
