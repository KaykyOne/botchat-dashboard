import dotenv from "dotenv";
import startBot from "./bots/bot";
import express from 'express';
const app = express();
import { disconnect, start } from "./controller/bot.controller";
import cors from 'cors';
import { organizerUsuarios } from "./funcs/useBot";

dotenv.config();

app.route("/disconnect/:id").get(disconnect);
app.route("/start/:id").get(start);

app.use(cors({
    origin: '*'
}));

startBot();
organizerUsuarios();

const PORT = Number(process.env.PORT) || 3009;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor rodando em http://0.0.0.0:${PORT}`);
});




