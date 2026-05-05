import express from 'express';
import { serverEnv } from "./env";
import { serverRouter } from "./routes";

const app = express();

const PORT = serverEnv.PORT;

app.use(serverRouter);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor rodando em http://0.0.0.0:${PORT}`);
});