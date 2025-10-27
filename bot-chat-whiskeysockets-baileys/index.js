import {startBot, enviarMensagem, startSession } from "./src/bot.js";
import { realtimeSupabase, escutarQrCode } from './src/funcoes.js';
escutarQrCode(startSession);
realtimeSupabase(enviarMensagem);
startBot();