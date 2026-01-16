import { startBot } from "./bots/bot";
import { Usuarios } from "./generated/prisma/client";
import Funcoes from "./funcs/useUsuario";
import dotenv from "dotenv";
dotenv.config();

const usuarios: Usuarios[] = await Funcoes().getAllUsers();

if(usuarios.length === 0) {
    console.log("Nenhum usuário ativo com IA encontrada.");
    process.exit(0);
}

usuarios.forEach(usuario => {
    startBot(usuario.id);
});
