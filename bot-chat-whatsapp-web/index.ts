import { startBot } from "./src/bot";
import { Usuarios } from "./generated/prisma/client";
import Funcoes from "./src/funcoes";

const usuarios: Usuarios[] = await Funcoes().getAllUsers();

if(usuarios.length === 0) {
    console.log("Nenhum usuário ativo com IA encontrada.");
    process.exit(0);
}
usuarios.forEach(usuario => {
    startBot(usuario.id);
});
