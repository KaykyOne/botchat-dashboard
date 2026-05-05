import startBot from "./bots/bot";
import express from 'express';
const app = express();
import { disconnect, start } from "./controllers/bot.controller";
import cors from 'cors';
import { serverEnv } from "./env";
import { organizerUsuarios } from "./funcs/useBot";

app.route("/disconnect/:id").get(disconnect);
app.route("/start/:id").get(start);

app.use(cors({
    origin: '*'
}));

app.get("/", (req, res) => {  
    res.send("BotChat Dashboard API");
});

app.get("/status", (req, res) => {
    res.send("BotChat Dashboard API is running");
});

app.get("/start-bot", (req, res) => {
    console.log("Iniciando o bot...");
    startBot();
    organizerUsuarios();
    res.send("Bot started");
});

    startBot();
    organizerUsuarios();

const PORT = serverEnv.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor rodando em http://0.0.0.0:${PORT}`);
});




