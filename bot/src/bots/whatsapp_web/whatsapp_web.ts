import pkg, { Client, Message } from "whatsapp-web.js";
const { LocalAuth } = pkg;
import fs from "fs";
import useMensagem from "../../funcs/useMensagem";
import useBot from "../../funcs/useBot";
import { pegarVicioAleatorio } from "../../funcs/config";
import QrCodeTerminal from "qrcode-terminal";
import type { Usuario } from "../../types/usuario";
import { createLogger } from "../../logger";

const mensagensPendentes: { [key: string]: string } = {};
const timeouts: { [key: string]: NodeJS.Timeout } = {};
const TEMPO_ESPERA = 15000;

function juntarMensagens(numero: string, texto: string) {
    mensagensPendentes[numero] = mensagensPendentes[numero]
        ? mensagensPendentes[numero] + "\n" + texto
        : texto;

    if (timeouts[numero]) clearTimeout(timeouts[numero]);
}

const testTentativasDeReconexao = (a: number): boolean => a <= 5;

async function startBot(usuario: Usuario) {
    const baseLogger = createLogger({ module: "whatsapp-web", provider: "WEBJS" });

    if (!usuario.id) {
        baseLogger.warn("Tentativa de iniciar bot sem id de usuario");
        return;
    }

    const usuario_id = usuario.id;
    const sessionPath = "./src/bots/whatsapp_web/sessions";
    const clientId = `bot-whatsapp-web-${usuario_id}`;
    const botLogger = baseLogger.child({ usuarioId: usuario_id, clientId, sessionPath });

    botLogger.info("Iniciando cliente do WhatsApp Web");

    const funcoes = useMensagem();
    const botFuncs = useBot();

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId,
            dataPath: sessionPath
        }),
        puppeteer: {
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
            ]
        }
    });

    usuario.cliente = client;
    botLogger.debug("Cliente criado e referencia armazenada no usuario");

    client.on("qr", async (qr: string) => {
        try {
            usuario.qrCode = qr;
            usuario.ativado = true;
            await funcoes.atualizarQrCode(qr, usuario_id, "WEBJS");
            botLogger.info({ qrLength: qr.length }, "QR code gerado e persistido");
            QrCodeTerminal.generate(qr, { small: true });
        } catch (err) {
            botLogger.error({ err }, "Erro ao processar evento qr");
        }
    });

    // client.on("authenticated", () => {
    //     botLogger.info("Autenticacao concluida; aguardando ready");
    // });

    client.on("authenticated", () => {
        botLogger.info("Autenticacao concluida; aguardando ready");

        // @ts-ignore
        const page = client.pupPage;
        if (page) {
            page.on('console', (msg: any) => {
                botLogger.debug({ type: msg.type(), text: msg.text() }, "puppeteer:console");
            });
            page.on('pageerror', (err: any) => {
                botLogger.error({ err: err.message }, "puppeteer:pageerror");
            });
            page.on('requestfailed', (req: any) => {
                botLogger.warn({ url: req.url(), failure: req.failure()?.errorText }, "puppeteer:requestfailed");
            });
        }
    });

    client.on("loading_screen", (percent: number, message: string) => {
        botLogger.debug({ percent, message }, "Atualizacao da tela de carregamento");
    });

    client.on("change_state", (state: string) => {
        botLogger.info({ state }, "Estado interno do cliente alterado");
    });

    client.on("loading_screen", (percent: number, message: string) => {
        botLogger.info({ percent, message }, "Loading screen");
    });

    client.on("ready", async () => {
        try {
            await funcoes.atualizarConecao(usuario_id, "ONLINE", "WEBJS");
            usuario.tentativasReconexao = 0;
            botLogger.info("Cliente pronto e marcado como ONLINE");
        } catch (err) {
            botLogger.error({ err }, "Erro ao processar evento ready");
        }
    });

    client.on("disconnected", async (reason: unknown) => {
        try {
            botLogger.warn({ reason }, "Cliente desconectado");
            usuario.cliente = null;
            usuario.qrCode = null;
            await funcoes.atualizarConecao(usuario_id, "OFFLINE", "WEBJS");

            if (!usuario.ativado) {
                botLogger.warn("Cliente desconectado com usuario desativado; sem reconexao");
                return;
            }

            if (usuario.tentativasReconexao) {
                usuario.tentativasReconexao += 1;
                const ok = testTentativasDeReconexao(usuario.tentativasReconexao);

                if (ok) {
                    botLogger.warn({ tentativa: usuario.tentativasReconexao }, "Tentando reconectar cliente");
                    startBot(usuario);
                } else {
                    botLogger.error({ tentativa: usuario.tentativasReconexao }, "Limite de reconexoes atingido");
                }

                return;
            }

            usuario.tentativasReconexao = 1;
            await funcoes.atualizarQrCode("", usuario_id, "WEBJS");
            botLogger.warn({ tentativa: usuario.tentativasReconexao }, "Primeira tentativa de reconexao");
            startBot(usuario);
        } catch (err) {
            botLogger.error({ err, reason }, "Erro ao processar evento disconnected");
        }
    });

    client.on("auth_failure", async (message: string) => {
        try {
            botLogger.error({ message }, "Falha de autenticacao detectada");
            usuario.cliente = null;
            usuario.qrCode = null;
            await funcoes.atualizarConecao(usuario_id, "OFFLINE", "WEBJS");

            if (!usuario.ativado) {
                botLogger.warn("Falha de autenticacao com usuario desativado; sem reconexao");
                return;
            }

            if (usuario.tentativasReconexao) {
                usuario.tentativasReconexao += 1;
                const ok = testTentativasDeReconexao(usuario.tentativasReconexao);

                if (ok) {
                    botLogger.warn({ tentativa: usuario.tentativasReconexao }, "Tentando reconectar apos auth_failure");
                    startBot(usuario);
                } else {
                    botLogger.error({ tentativa: usuario.tentativasReconexao }, "Limite de reconexoes apos auth_failure atingido");
                }

                return;
            }

            usuario.tentativasReconexao = 1;
            botLogger.warn({ tentativa: usuario.tentativasReconexao }, "Primeira reconexao apos auth_failure");
            startBot(usuario);
        } catch (err) {
            botLogger.error({ err, message }, "Erro ao processar evento auth_failure");
        }
    });

    client.on("message", async (msg: Message) => {
        if (msg.from.endsWith("@g.us")) return;

        botLogger.debug({
            from: msg.from,
            type: msg.type,
            hasMedia: msg.hasMedia,
            fromMe: msg.fromMe
        }, "Mensagem recebida");

        const numero = msg.from.replace("@c.us", "");
        const remoteJid = msg.from;

        if (msg.type === "image" || msg.type === "video") {
            await client.sendMessage(remoteJid, "Desculpe, no momento so consigo responder mensagens de texto ou voz.");
            return;
        }

        const msgTimestamp = Math.floor(msg.timestamp);
        const agora = Math.floor(Date.now() / 1000);
        if (agora - msgTimestamp > 10) return;

        try {
            const res: boolean = await funcoes.testMensagem(msg, numero, client);
            if (!res) return;

            let texto = "";
            let numeroAudios = 0;

            if (msg.type === "ptt" || msg.type === "audio") {
                const media = await msg.downloadMedia();
                if (!media) return;

                const buffer = Buffer.from(media.data, "base64");
                const path = `./src/bots/whatsapp_web/audios/${numero}-${numeroAudios}.ogg`;
                fs.writeFileSync(path, buffer);

                texto = await botFuncs.converterAudioEmTexto(path) || "";
                numeroAudios++;
                botLogger.debug({ from: remoteJid, transcriptLength: texto.length }, "Audio transcrito");
            } else {
                texto = msg.body || "";
            }

            juntarMensagens(numero, texto);

            timeouts[numero] = setTimeout(async () => {
                const mensagens = mensagensPendentes[numero];
                delete mensagensPendentes[numero];
                delete timeouts[numero];

                const resposta = await botFuncs.responderPergunta(mensagens, numero, usuario_id, client);

                if (!resposta) return;

                const partes = resposta.includes("(SEPARAR)")
                    ? resposta.split("(SEPARAR)")
                    : [resposta];

                await client.sendMessage(remoteJid, pegarVicioAleatorio());

                for (const p of partes) {
                    await new Promise(r => setTimeout(r, 1500));
                    await client.sendMessage(remoteJid, `*BOT IDEALZINHO:*\n${p}`);
                }

                botLogger.debug({ from: remoteJid, partes: partes.length }, "Resposta enviada ao cliente");
            }, TEMPO_ESPERA);
        } catch (err) {
            botLogger.error({ err, from: msg.from }, "Erro ao processar mensagem recebida");
        }
    });

    client.initialize()
        .then(() => {
            botLogger.info("Inicializacao do cliente disparada com sucesso");
        })
        .catch((err) => {
            botLogger.error({ err }, "Falha ao inicializar cliente");
        });

    return usuario;
}

async function disconnectBot(usuario: Usuario) {
    if (!usuario || !usuario.cliente) return;

    const botLogger = createLogger({
        module: "whatsapp-web",
        provider: "WEBJS",
        usuarioId: usuario.id,
        clientId: `bot-whatsapp-web-${usuario.id}`
    });

    try {
        const client = usuario.cliente as Client;

        if (client == null) {
            botLogger.warn("Cliente ja esta nulo, pulando desconexao");
            return;
        }

        botLogger.info("Desconectando cliente do usuario");
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

        botLogger.info("Cliente desconectado com sucesso");
    } catch (err) {
        botLogger.error({ err }, "Erro ao desconectar cliente");
        usuario.cliente = null;
        usuario.ativado = false;
    }
}

export { startBot, disconnectBot };
