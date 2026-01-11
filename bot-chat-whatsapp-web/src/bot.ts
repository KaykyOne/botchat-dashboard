// ES Modules
import pkg, { Client, Message } from 'whatsapp-web.js';
import QrCodeTerminal from 'qrcode-terminal';
const { LocalAuth } = pkg;
import dotenv from 'dotenv';
dotenv.config();
import Funcoes from './funcoes';

const mensagensPendentes: { [key: string]: string } = {};
const timeouts: { [key: string]: NodeJS.Timeout } = {};
const TEMPO_ESPERA = 2000;

const clients: Record<number, Client> = {};
const qrCodes: Record<number, string> = {};

const funcoes = Funcoes();

// Junta mensagens do mesmo número
function juntarMensagens(numero: string, texto: string) {
    mensagensPendentes[numero] = mensagensPendentes[numero]
        ? mensagensPendentes[numero] + '\n' + texto
        : texto;

    if (timeouts[numero]) clearTimeout(timeouts[numero]);
}

const testTentativasDeReconexao = (a: number) => { a > 5 && process.exit(0); return; }

// Inicializa o bot
function startBot(usuario_id: number) {
    console.log(`Iniciando bot para o usuário ${usuario_id}`);

    if (clients[usuario_id]) {
        console.log(`Bot do usuário ${usuario_id} já está rodando`);
        return;
    }

    let tentativasDeReconexao: number = 0;

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: `bot-${usuario_id}`
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
        QrCodeTerminal.generate(qr, { small: true });
    });

    client.on('ready', () => {
        const meuNumero = client.info.wid.user;
        console.log(meuNumero);
        console.log(`✅ Bot do usuário ${usuario_id} está pronto!`);
        funcoes.atualizarConecao(usuario_id, 'ONLINE');
    });

    client.on('disconnected', (reason: any) => {
        tentativasDeReconexao++;
        testTentativasDeReconexao(tentativasDeReconexao);
        console.log('❌ Bot desconectado. Tentando reconectar...', reason);
        setTimeout(startBot, 5000);
    });

    client.on('auth_failure', () => {
        tentativasDeReconexao++;
        testTentativasDeReconexao(tentativasDeReconexao);
        console.log('⚠️ Falha na autenticação. Reiniciando bot...');
        setTimeout(startBot, 5000);
    });

    client.on('message', async (msg: Message) => {
        try {
            let numero = msg.from;
            const res: boolean = await funcoes.testMensagem(msg, numero, client);

            if (!res) return;
            numero = await funcoes.formatarNumero(numero, client);

            const texto = msg.body || '';
            const msgTimestamp = Math.floor(msg.timestamp);
            const agora = Math.floor(Date.now() / 1000);
            if (agora - msgTimestamp > 10) return;

            juntarMensagens(numero, texto);

            timeouts[numero] = setTimeout(async () => {
                const mensagens = mensagensPendentes[numero];
                delete mensagensPendentes[numero];
                delete timeouts[numero];

                const res = await funcoes.responderPergunta(mensagens, numero, usuario_id, client);
                // console.log('Resposta gerada para', res);
                await new Promise(r => setTimeout(r, 1500));
                const response = `*BOT IDEALZINHO:*\n${res}`;
                await client.sendMessage(`${numero}@c.us`, response);
            }, TEMPO_ESPERA);

        } catch (err) {
            console.error(err);
        }
    });

    client.initialize();
}

export { startBot };