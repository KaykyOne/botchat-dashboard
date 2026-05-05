import express from "express";
const serverRouter = express.Router();
import { disconnect, start } from "../controllers/bot.controller";
import { organizerUsuarios } from "../funcs/useBot";
import startBot from "../bots/bot";
import cors from "cors";


serverRouter.route("/disconnect/:id").get(disconnect);
serverRouter.route("/start/:id").get(start);

serverRouter.use(cors({
    origin: '*'
}));

serverRouter.get("/", (req, res) => {  
    res.send("BotChat Dashboard API");
});

serverRouter.get("/status", (req, res) => {
    res.send("BotChat Dashboard API is running");
});

serverRouter.get("/start-bot", (req, res) => {
    console.log("Iniciando o bot...");
    startBot();
    organizerUsuarios();
    res.send("Bot started");
});

export default serverRouter;
