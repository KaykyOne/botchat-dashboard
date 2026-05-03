import fs from "fs";
import { startBot as startBaylears, disconnectBot as disconnectBayleys } from "../bots/baileys/baileys";
import { Usuario } from "../bots/bot";
import path from "path";
import useMensagem from '../funcs/useMensagem';

const root = process.cwd();
const { atualizarQrCode } = useMensagem();

let usuarios: Usuario[] = []

async function disconnectBot(id: number) {
    try {
        const user = usuarios.find(e => e.id == id);
        if (!user) return;

        // Chamar função de disconnect completa do Baileys
        await disconnectBayleys(user);
        
        await new Promise(r => setTimeout(r, 4000))

        const namePathBaileys = path.join(root, "src/bots/baileys/sessions", `bot-baileys-${id}`);
        const namePathWhatsappWeb = path.join(root, "src/bots/whatsapp_web/sessions", `bot-whatsapp_web-${id}`);

        if (fs.existsSync(namePathBaileys)) {
            fs.rmSync(namePathBaileys, { recursive: true, force: true });
        }

        if (fs.existsSync(namePathWhatsappWeb)) {
            fs.rmSync(namePathWhatsappWeb, { recursive: true, force: true });
        }
        
        await atualizarQrCode("", user.id, "BAILEYS");
        usuarios = usuarios.filter(e => e.id != id);
        console.log(`✅ Usuário ${id} removido da lista de ativos`);
        return;
    }
    catch (erro) {
        console.error("Erro ao desconectar no service!", erro);
        usuarios = usuarios.filter(e => e.id != id);
        return;
    }

}

async function startBot(id: number) {
    const user: Usuario = {
        id: id,
        qrCode: null,
        cliente: null,
        ativado: false
    }

    const res: Usuario | void = await startBaylears(user);
    if (res != null) {
        usuarios.push(res);
    }
}

export { disconnectBot, startBot, usuarios }