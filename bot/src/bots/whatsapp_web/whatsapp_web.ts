// whatsapp_web.ts
import pkg, { Client, Message } from 'whatsapp-web.js';
const { LocalAuth } = pkg;
import fs from 'fs';
import useMensagem from '../../funcs/useMensagem';
import useBot from '../../funcs/useBot';
import { pegarVicioAleatorio } from '../../funcs/config';
import QrCodeTerminal from 'qrcode-terminal';
import { Usuario } from '../bot';

// Funções genéricas (locais, não exportadas)
const mensagensPendentes: { [key: string]: string } = {};
const timeouts: { [key: string]: NodeJS.Timeout } = {};
const TEMPO_ESPERA = 15000;

function juntarMensagens(numero: string, texto: string) {
    mensagensPendentes[numero] = mensagensPendentes[numero]
        ? mensagensPendentes[numero] + '\n' + texto
        : texto;

    if (timeouts[numero]) clearTimeout(timeouts[numero]);
}

const testTentativasDeReconexao = (a: number): boolean => {
    return a <= 5;
};

async function startBot(usuario: Usuario) {
    if (!usuario.id) {
        console.log(`id não encontrado!`);
        return;
    }

    const usuario_id = usuario.id;
    console.log(`Iniciando bot para o usuário ${usuario_id}`);

    const funcoes = useMensagem();
    const botFuncs = useBot();

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: `bot-whatsapp-web-${usuario_id}`,
            dataPath: `./src/bots/whatsapp_web/sessions`
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    usuario.cliente = client;

    // QR
    client.on('qr', async (qr: string) => {
        usuario.qrCode = qr;
        await funcoes.atualizarQrCode(qr, usuario_id, "WEBJS");
        console.log(`QR code do usuário ${usuario_id} atualizado!`);
        QrCodeTerminal.generate(qr, { small: true });
        usuario.ativado = true;
    });

    // PRONTO
    client.on('ready', async () => {
        console.log(`✅ Bot do usuário ${usuario_id} está online`);
        await funcoes.atualizarConecao(usuario_id, 'ONLINE', "WEBJS");
        usuario.tentativasReconexao = 0;
    });

    // DESCONECTADO
    client.on('disconnected', async (reason: any) => {
        console.log(`❌ Bot do usuário ${usuario_id} desconectado`, reason);
        usuario.cliente = null;
        usuario.qrCode = null;
        await funcoes.atualizarConecao(usuario_id, 'OFFLINE', "WEBJS");

        if (usuario.ativado) {
            if (usuario.tentativasReconexao) {
                usuario.tentativasReconexao += 1;
                const ok = testTentativasDeReconexao(usuario.tentativasReconexao);
                if (ok) {
                    console.log(`Tentando reconectar o bot do usuario ${usuario_id} pela ${usuario.tentativasReconexao}`);
                    startBot(usuario);
                }
            } else {
                usuario.tentativasReconexao = 1;
                console.log(`Tentando reconectar o bot do usuario ${usuario_id} pela ${usuario.tentativasReconexao}`);
                await funcoes.atualizarQrCode("", usuario_id, "WEBJS");
                startBot(usuario);
            }
        }
    });

    // FALHA DE AUTH
    client.on('auth_failure', async () => {
        console.log(`⚠️ Falha na autenticação do bot do usuario: ${usuario_id}`);
        usuario.cliente = null;
        usuario.qrCode = null;
        await funcoes.atualizarConecao(usuario_id, 'OFFLINE', "WEBJS");

        if (usuario.ativado) {
            if (usuario.tentativasReconexao) {
                usuario.tentativasReconexao += 1;
                const ok = testTentativasDeReconexao(usuario.tentativasReconexao);
                if (ok) {
                    console.log(`Tentando reconectar o bot do usuario ${usuario_id} pela ${usuario.tentativasReconexao}`);
                    startBot(usuario);
                }
            } else {
                usuario.tentativasReconexao = 1;
                startBot(usuario);
            }
        }
    });

    // MENSAGENS
    client.on('message', async (msg: Message) => {
        if (msg.from.endsWith('@g.us')) return;
        console.log(`Mensagem recebida do usuário ${usuario_id}:`, msg.body);
        const numero = msg.from.replace('@c.us', '');
        const remoteJid = msg.from;

        if (msg.type === 'image' || msg.type === 'video') {
            await client.sendMessage(remoteJid, 'Desculpe, no momento só consigo responder mensagens de texto ou voz.');
            return;
        }

        const msgTimestamp = Math.floor(msg.timestamp);
        const agora = Math.floor(Date.now() / 1000);
        if (agora - msgTimestamp > 10) return;

        try {
            const res: boolean = await funcoes.testMensagem(msg, numero, client);
            if (!res) return;

            let texto = '';
            let numeroAudios = 0;

            if (msg.type === 'ptt' || msg.type === 'audio') {
                const media = await msg.downloadMedia();
                if (!media) return;

                const buffer = Buffer.from(media.data, 'base64');
                const path = `./src/bots/whatsapp_web/audios/${numero}-${numeroAudios}.ogg`;
                fs.writeFileSync(path, buffer);

                texto = await botFuncs.converterAudioEmTexto(path) || '';
                numeroAudios++;
                console.log('Transcrição do áudio:', texto);
            } else {
                texto = msg.body || '';
            }

            juntarMensagens(numero, texto);

            timeouts[numero] = setTimeout(async () => {
                const mensagens = mensagensPendentes[numero];
                delete mensagensPendentes[numero];
                delete timeouts[numero];

                const resposta = await botFuncs.responderPergunta(mensagens, numero, usuario_id, client);

                if (!resposta) return;

                const partes = resposta.includes('(SEPARAR)')
                    ? resposta.split('(SEPARAR)')
                    : [resposta];

                await client.sendMessage(remoteJid, pegarVicioAleatorio());

                for (const p of partes) {
                    await new Promise(r => setTimeout(r, 1500));
                    await client.sendMessage(remoteJid, `*BOT IDEALZINHO:*\n${p}`);
                }

            }, TEMPO_ESPERA);

        } catch (err) {
            console.error(err);
        }
    });

    client.initialize();
    return usuario;
}

async function disconnectBot(usuario: Usuario) {
    if (!usuario || !usuario.cliente) return;

    try {
        const client = usuario.cliente as Client;
        const usuario_id = usuario.id;

        if (client == null) {
            console.log(`Cliente do usuário ${usuario_id} já está nulo, pulando desconexão.`);
            return;
        }

        console.log(`🔌 Desconectando bot do usuário ${usuario_id}`);

        usuario.ativado = false;

        Object.keys(timeouts).forEach(numero => {
            clearTimeout(timeouts[numero]);
            delete timeouts[numero];
        });

        Object.keys(mensagensPendentes).forEach(numero => {
            delete mensagensPendentes[numero];
        });

        await client.destroy();

        usuario.cliente = null;
        usuario.qrCode = null;

        console.log(`✅ Bot do usuário ${usuario_id} foi desconectado com sucesso`);
    } catch (erro) {
        console.error(`Erro ao desconectar bot do usuário:`, erro);
        usuario.cliente = null;
        usuario.ativado = false;
    }
}

export { startBot, disconnectBot };