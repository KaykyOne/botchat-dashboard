
import { Historico, Leads } from '../../generated/prisma/client.js';
const KEY: string | undefined = process.env.KEY;
import prisma from '../../prisma/prisma.js';
import useUsuario from './useUsuario.js';
import { configurePrompt, promptColombo, Message } from './config.js';

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

  async function getHistorico(usuario_id: number, numero: string, mensagem: string) {

    let his: Message[] = [];
    his.push({ role: 'user', content: mensagem });

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

    const historico: Message[] = historicoBanco.map(msg => {
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

    const promptBanco: string | null = await getPrompt(usuario_id);
    let superPropt = configurePrompt(promptBanco);

    const atividade = await getAtividade(usuario_id, numero);
    if (!atividade) return;

    let historico = await getHistorico(usuario_id, numero, mensagem);
    superPropt.unshift(...historico);
    historico = superPropt;

    const lead = await prisma.leads.findFirst({
      where: { numero: numero, cliente_id: usuario_id },
      select: { id: true, interesse: true }
    })

    await atualizarInteresse(historico, lead).catch(err => console.error("Erro ao atualizar interesse:", err));
    if (lead?.interesse) {
      historico.push({ role: 'system', content: `interesse atual do usuario:${lead.interesse}` });
    }

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
        temperature: 0.1,
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

  async function atualizarInteresse(historico: Message[], lead: any) {
    const mensagensDoCliente = historico.filter(msg => msg.role === 'user').length;
    const historicoFiltrado = historico.filter(msg => msg.role !== 'system');

    let mensagensParaAnalise = historicoFiltrado.slice(-10);
    mensagensParaAnalise.unshift({ role: 'system', content: promptColombo });
    if (mensagensDoCliente > 3 && mensagensDoCliente <= 5) {

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
          messages: mensagensParaAnalise,
          temperature: 0.1,
          stop: ["Mensagem do usuário:", "Resposta:"]
        })
      });

      const json = await res.json();
      const resposta = json.choices[0].message.content;

      let parsed;

      try {
        parsed = JSON.parse(resposta);
      } catch (e) {
        console.error("JSON inválido retornado pelo Colombo:", resposta);
        return;
      }

      await prisma.leads.update({
        where: { id: lead?.id },
        data: { interesse: parsed.interesse || "" }
      });
    }
  }

  return {
    responderPergunta,
  };
}




// export { responderPergunta, realtimeSupabase, deleteFolder, escutarQrCode, atualizarQrCode, testMensagem, enviarMensagem, formatarNumero };