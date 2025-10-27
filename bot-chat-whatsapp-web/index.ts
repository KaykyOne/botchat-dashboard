import {startBot, client, enviarMensagem } from "./src/bot";
import { realtimeSupabase, escutarQrCode } from './src/funcoes';
escutarQrCode(client);
realtimeSupabase(enviarMensagem);
startBot();