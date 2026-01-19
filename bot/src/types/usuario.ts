import { WASocket } from "@whiskeysockets/baileys";
import { Client } from "whatsapp-web.js";

type Usuario = {
    id: number,
    cliente: WASocket | Client | null,
    qrCode: string | null,
    tentativasReconexao?: number,
    ativado:boolean,
}

export { type Usuario }

