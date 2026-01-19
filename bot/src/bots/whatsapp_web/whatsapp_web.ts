// ES Modules
import pkg, { Client, Message } from 'whatsapp-web.js';
const { LocalAuth } = pkg;
import fs from 'fs';
import useMensagem from '../../funcs/useMensagem';
import useBot from '../../funcs/useBot';
import { pegarVicioAleatorio } from '../../funcs/config';
import QrCodeTerminal from 'qrcode-terminal';
import { juntarMensagens, testTentativasDeReconexao, timeouts, mensagensPendentes, TEMPO_ESPERA } from '../bot';

const clients: Record<number, Client> = {};
const qrCodes: Record<number, string> = {};

function startBot(usuario_id: number) {
    const funcoes = useMensagem();
    const botFuncs = useBot();

    console.log(`Iniciando bot para o usuário ${usuario_id}`);

    if (clients[usuario_id]) {
        console.log(`Bot do usuário ${usuario_id} já está rodando`);
        return;
    }

    let tentativasDeReconexao: number = 0;

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: `bot-whatsapp-web-${usuario_id}`,
            dataPath: "sessions"
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    clients[usuario_id] = client;

    client.on('qr', async (qr: string) => {
        qrCodes[usuario_id] = qr;
        await funcoes.atualizarQrCode(qr, usuario_id);
        console.log(`QR code do usuario: ${usuario_id} no whatsapp-web\n`);
        QrCodeTerminal.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log(`✅ Bot do usuário ${usuario_id} está pronto!`);
        funcoes.atualizarConecao(usuario_id, 'ONLINE');
    });

    client.on('disconnected', (reason: any) => {
        tentativasDeReconexao++;
        testTentativasDeReconexao(tentativasDeReconexao);
        console.log(`❌ Bot do usuario ${usuario_id} desconectado. Tentando reconectar...`, reason);
        setTimeout(startBot, 5000);
    });

    client.on('auth_failure', () => {
        tentativasDeReconexao++;
        testTentativasDeReconexao(tentativasDeReconexao);
        console.log(`⚠️ Falha na autenticação do bot do usuario: ${usuario_id}. Reiniciando bot...`);
        setTimeout(startBot, 5000);
    });

    client.on('message', async (msg: Message) => {
        if (msg.from.endsWith('@g.us')) return;

        let numero = msg.from;
        if (msg.type === 'image' || msg.type === 'video') {
            await client.sendMessage(`${numero}@c.us`, 'Desculpe, no momento só consigo responder mensagens de texto ou voz. Por favor, envie sua pergunta em formato de texto ou voz.');
        }

        try {
            const res: boolean = await funcoes.testMensagem(msg, numero, client);

            if (!res) return;
            let numeroAudios = 0;
            let texto = '';
            numero = await funcoes.formatarNumero(numero, client);
            if (msg.type == 'ptt' || msg.type === 'audio') {
                const media = await msg.downloadMedia();
                if (!media) return;

                const buffer = Buffer.from(media.data, 'base64');
                fs.writeFileSync(`audios/${numero}-${numeroAudios}.ogg`, buffer);

                texto = await botFuncs.converterAudioEmTexto(`audios/${numero}-${numeroAudios}.ogg`) || '';
                numeroAudios++;
                console.log('Transcrição do áudio:', texto);
            } else {
                texto = msg.body || '';
            }

            const msgTimestamp = Math.floor(msg.timestamp);
            const agora = Math.floor(Date.now() / 1000);
            if (agora - msgTimestamp > 10) return;

            juntarMensagens(numero, texto);

            timeouts[numero] = setTimeout(async () => {
                const mensagens = mensagensPendentes[numero];
                delete mensagensPendentes[numero];
                delete timeouts[numero];

                const res = await botFuncs.responderPergunta(mensagens, numero, usuario_id, client);
                numeroAudios = 0;
                const chat = await msg.getChat();
                if (!chat) return;
                // console.log('Resposta gerada para', res);
                if (res) {
                    await client.sendMessage(`${numero}@c.us`, pegarVicioAleatorio());
                }
                if (res) {
                    const mensagems = res.includes('(SEPARAR)') ? res.split('(SEPARAR)') : [res];
                    if (mensagems.length > 1) {
                        for (const m of mensagems) {
                            await new Promise(r => setTimeout(r, 1500));
                            const response = `*BOT IDEALZINHO:*\n${m}`;
                            await client.sendMessage(`${numero}@c.us`, response);
                        }
                    } else {
                        await new Promise(r => setTimeout(r, 1500));
                        const response = `*BOT IDEALZINHO:*\n${res}`;
                        await client.sendMessage(`${numero}@c.us`, response);
                    }
                }
            }, TEMPO_ESPERA);

        } catch (err) {
            console.error(err);
        }
    });

    client.initialize();
}

export { startBot };