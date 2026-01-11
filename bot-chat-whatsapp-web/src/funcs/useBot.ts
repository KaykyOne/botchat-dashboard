
import { Historico, Leads } from '../../generated/prisma/client.js';
const KEY: string | undefined = process.env.KEY;
import prisma from '../../prisma/prisma.js';
import useUsuario from './useUsuario.js';
import { configurePrompt } from './config.js';

const { getAtividade } = useUsuario();

export default function useBot() {
  async function getPrompt(usuario_id: number) {
    const data = await prisma.usuarios.findFirst({
      where: { id: usuario_id },
      select: { prompt: true }
    });

    return data ? data.prompt : "responda educadamente epenas, sorria e acene"
  }

  async function criarLead(usuario_id: number, numero: string) {
    const lead = await prisma.leads.findFirst({
      where: { numero: numero, cliente_id: usuario_id },
      select: { id: true }
    });
    if (!lead) {
      await prisma.leads.create({
        data: {
          cliente_id: usuario_id,
          numero: numero,
          ia_ativa: true
        }
      });
    }

    return;
  }

  async function getHistorico(usuario_id: number, numero: string, mensagem: string, promptBanco: string | null) {

    let his: Object[] = [];
    his.push({ role: 'user', content: mensagem });

    const promptFinal = configurePrompt(promptBanco || '');

    his.unshift(...promptFinal);

    const lead = await prisma.leads.findFirst({
      where: { numero: numero, cliente_id: usuario_id },
      select: { id: true }
    })

    if (!lead) {
      await criarLead(usuario_id, numero);
      return his;
    }

    const historicoBanco = await prisma.historico.findMany({
      where: {
        lead_id: lead.id
      },
      orderBy: {
        criado_em: 'asc'
      }
    })

    const historico: Object[] = historicoBanco.map(msg => {
      return { role: msg.autor === 'Lead' ? 'user' : 'assistant', content: msg.mensagem }
    })

    historico.push(...his);
    return historico;
  }

  async function insertHistorico(historico: Partial<Historico>) {



    await prisma.historico.create({
      data: {
        autor: historico.autor!,
        mensagem: historico.mensagem!,
        lead_id: historico.lead_id!,
        tokens_usados: historico.tokens_usados || 0
      }
    })

    return;
  }

  async function responderPergunta(mensagem: string, numero: string, usuario_id: number, client?: any) {

    const promptBanco = await getPrompt(usuario_id);

    const atividade = await getAtividade(usuario_id, numero);
    if (!atividade) return;

    const historico = await getHistorico(usuario_id, numero, mensagem, promptBanco);

    const lead = await prisma.leads.findFirst({
      where: { numero: numero, cliente_id: usuario_id },
      select: { id: true }
    })

    if (!KEY) {
      console.error('Chave da API não definida.');
      return 'Desculpe, estou enfrentando problemas técnicos no momento.';
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: historico,
        temperature: 0,
        stop: ["Mensagem do usuário:", "Resposta:"]
      })
    });

    const json = await res.json();
    const resposta = json.choices[0].message.content;

    if (lead) {
      await insertHistorico({
        autor: 'Lead',
        mensagem: mensagem,
        lead_id: lead ? lead.id : 0,
        tokens_usados: mensagem.length
      });

      await insertHistorico({
        autor: 'Assistant',
        mensagem: resposta,
        lead_id: lead ? lead.id : 0,
        tokens_usados: resposta.length
      });
    }

    return resposta;
  }

  return {
    responderPergunta,
  };
}




// export { responderPergunta, realtimeSupabase, deleteFolder, escutarQrCode, atualizarQrCode, testMensagem, enviarMensagem, formatarNumero };