import { Request, Response } from "express"
import { disconnectBot, startBot } from "../service/bot.service";

async function disconnect(req: Request, res: Response) {
    const id = req.params.id

    if (!id) {
        res.status(400).send({ message: "Id não encontrado!" })
        return;
    }
    try {
        await disconnectBot(Number(id));
        res.status(200).send({ message: "Usuário desconectado com sucesso!" });
        return;
    } catch (error) {
        res.status(500).send({ message: "Erro ao desconectar usuario!" });
        return;
    }

}

async function start(req: Request, res: Response) {
    const id = req.params.id

    if (!id) {
        res.status(400).send({ message: "Id não encontrado!" })
        return;
    }
    try {
        await startBot(Number(id));
        res.status(200).send({ message: "Usuário desconectado com sucesso!" });
        return;
    } catch (error) {
        res.status(500).send({ message: "Erro ao desconectar usuario!" });
        return;
    }

}

export { disconnect, start };