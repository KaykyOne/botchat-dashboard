import { startBot as startBaylears } from "./baileys/baileys";
import { startBot as startWhatsapp } from "./whatsapp_web/whatsapp_web";
import { Usuarios } from "../../generated/prisma/client";
import Funcoes from "../funcs/useUsuario";

const mensagensPendentes: { [key: string]: string } = {};
const timeouts: { [key: string]: NodeJS.Timeout } = {};

const TEMPO_ESPERA = 15000;

function juntarMensagens(numero: string, texto: string) {
    mensagensPendentes[numero] = mensagensPendentes[numero]
        ? mensagensPendentes[numero] + '\n' + texto
        : texto;

    if (timeouts[numero]) clearTimeout(timeouts[numero]);
}

const testTentativasDeReconexao = (a: number) => { a > 5 && process.exit(0); return; }

const startBot = async () => {
    const usuarios: Usuarios[] = await Funcoes().getAllUsers();

    if (usuarios.length === 0) {
        console.log("Nenhum usuário ativo com IA encontrada.");
        process.exit(0);
    }

    usuarios.forEach(usuario => {
        startBaylears(usuario.id);
    });

    console.log("Todos os bots iniciado!");

    return;
}

export { juntarMensagens, testTentativasDeReconexao, timeouts, mensagensPendentes, TEMPO_ESPERA }
export default startBot;