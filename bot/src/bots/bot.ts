import { startBot as startBaylears } from "./baileys/baileys";
// import { startBot as startWhatsapp } from "./whatsapp_web/whatsapp_web";
import { Usuarios } from "../../generated/prisma/client";
import Funcoes from "../funcs/useUsuario";
import { Usuario } from "../types/usuario";
import { usuarios } from "../service/bot.service";

let iniciado = false;

const startBot = async () => {
    const search: Usuarios[] = await Funcoes().getAllUsers();
    if (search.length > 0) {
        search.forEach(user => {
            usuarios.push({ id: user.id, cliente: null, qrCode: null, ativado: false })
        });

        if (usuarios.length === 0) {
            console.log("Nenhum usuário ativo com IA encontrada.");
            process.exit(0);
        }

        usuarios.forEach(usuario => {
            startBaylears(usuario);
        });

        console.log("Todos os bots iniciado!");
        iniciado = true;
        return;
    }else{
        console.log("Nenhum bot encontrado!");
        return;
    }
}

setInterval(() => {
    if(!iniciado) return;
    const filter = usuarios.filter(user => user.ativado === true);
    if(filter.length == 0){
        console.error("Todos os usuários foram desligados!");
    }else{
        console.log(`Número de usuários ativos: ${usuarios.length}`);
    }
}, 10000)

export default startBot;
export { type Usuario }