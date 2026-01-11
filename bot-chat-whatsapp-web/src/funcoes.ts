import dotenv from 'dotenv';
import { InstanceStatus } from '../generated/prisma/enums.js';
import { Leads } from '../generated/prisma/client.js';
dotenv.config();
const KEY: string | undefined = process.env.KEY;
import fs from 'fs/promises';
import prisma from '../prisma/prisma.js';

export default function Funcoes() {
  async function getPrompt(usuario_id: number) {
    const data = await prisma.usuarios.findFirst({
      where: { id: usuario_id },
      select: { prompt: true }
    });

    return data ? data.prompt : "responda educadamente epenas, sorria e acene"
  }

  async function getAtividade(usuario_id?: number, telefone?: string) {

    console.log('Verificando atividade para usuário:', usuario_id, 'e telefone:', telefone);

    if (!usuario_id || !telefone) return false;
    const testUsuario = await prisma.usuarios.findFirst({
      where: { id: usuario_id },
      select: { ia_ativa: true, ativo: true }
    });
    console.log('Teste usuário:', testUsuario ? true : false);

    const testLead = await prisma.leads.findFirst({
      where: { numero: telefone, cliente_id: usuario_id },
      select: { ia_ativa: true }
    });

    console.log('Teste lead:', testLead ? true : false);

    const data = testLead?.ia_ativa && testUsuario?.ia_ativa && testUsuario?.ativo;

    return data || false;
  }

  async function criarLead(leadsData: Partial<Leads>, numero: string) {
    const lead = await prisma.leads.findFirst({
      where: { numero: leadsData.numero, cliente_id: leadsData.cliente_id },
      select: { id: true }
    });
    if (!lead) {
      await prisma.leads.create({
        data: {
          cliente_id: leadsData.cliente_id!,
          numero: numero,
          qualidade: 'FRIA',
          ia_ativa: true
        }
      });
    }

    return;
  }

  async function responderPergunta(mensagem: string, numeroPuro: string, usuario_id: number, client?: any) {

    const numero = await formatarNumero(numeroPuro, client);
    const promptBanco = await getPrompt(usuario_id);
    await criarLead({ cliente_id: usuario_id }, numero);

    const atividade = await getAtividade(usuario_id, numero);
    // console.log('Atividade verificada:', atividade);
    if (!atividade) return;

    // const numeroCorrigido = numero.split('@');

    let historico: Object[] = [{ role: 'system', content: promptBanco }];
    historico.push({ role: 'user', content: mensagem });

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
    // console.error(res);
    // console.error(res.status);



    const json = await res.json();
    const resposta = json.choices[0].message.content;
    return resposta;
  }

  async function resolverNumero(lidId: string, client: any) {
    try {
      const contact = await client.getContactById(lidId);
      if (contact && contact.id) return contact.id._serialized; // ex: '5517997565378@c.us'
    } catch (err) {
      console.error('Erro ao tentar resolver LID:', err);
    }
    return null;
  }

  async function getAllUsers() {
    const users = await prisma.usuarios.findMany({
      where: { ia_ativa: true, ativo: true }
    });
    return users;
  }

  async function atualizarQrCode(qr: string, usuario_id: number) {

    const instance = await prisma.whatsappInstances.findFirst({
      where: { cliente_id: usuario_id, provider: 'WEBJS' }
    });

    if (!instance) {
      await prisma.whatsappInstances.create({
        data: {
          cliente_id: usuario_id,
          provider: 'WEBJS',
          qr_code: qr,
          status: 'CONNECTING',
          session_path: `session-bot-${usuario_id}`
        }
      });
      return;
    }
    else {
      await prisma.whatsappInstances.updateMany({
        where: { cliente_id: usuario_id, provider: 'WEBJS' },
        data: { qr_code: qr }
      })
      return;
    }

  }

  async function atualizarConecao(id_usuario: number, status: InstanceStatus) {
    await prisma.whatsappInstances.updateMany({
      where: { cliente_id: id_usuario, provider: 'WEBJS' },
      data: { status: status }
    });
  }

  async function testMensagem(msg: any, numero: string, client: any) {
    if (numero === 'status@broadcast' || numero.endsWith('@g.us')) return false;
    if (msg.fromMe) return false;
    else return true;
  }

  async function formatarNumero(numero: string, client: any) {
    if (!client) {
      // console.log('Cliente não fornecido para formatar o número.');
      return numero
    };
    if (numero.endsWith('@lid')) {
      // console.log('numero como identificador de lead, resolvendo...');

      const jidReal = await resolverNumero(numero, client);
      if (jidReal) numero = jidReal;
    } else {
      // console.log('numero padrão, formatando...');
      numero = numero.split('@')[0];
    }
    return numero;
  }

  async function marcarEnviada(id: number) {
    try {
      await prisma.mensagens.update({
        where: { id },
        data: { enviado_por_ia: true }
      });
      console.log('Status atualizado para enviada:', id);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  }

  // Função para buscar mensagens pendentes (substitui realtime do Supabase)
  async function buscarMensagensPendentes(usuario_id: number) {
    const mensagens = await prisma.mensagens.findMany({
      where: {
        origem_id: usuario_id,
        enviado_por_ia: false
      },
      include: {
        destino: true
      }
    });
    return mensagens;
  }

  // Polling para verificar novas mensagens (substitui realtime do Supabase)
  async function iniciarPollingMensagens(usuario_id: number, funct: any, intervalo: number = 5000) {
    setInterval(async () => {
      const mensagens = await buscarMensagensPendentes(usuario_id);

      for (const msg of mensagens) {
        const numeroFormatado = msg.destino.numero.includes('@c.us')
          ? msg.destino.numero
          : `${msg.destino.numero}@c.us`;

        funct(msg.conteudo, numeroFormatado);
        await marcarEnviada(msg.id);
      }
    }, intervalo);
  }

  async function deleteFolder(folderPath: string) {
    try {
      await fs.rm(folderPath, { recursive: true, force: true });
      console.log(`Pasta "${folderPath}" apagada com sucesso!`);
    } catch (err) {
      console.error('Erro ao apagar pasta:', err);
    }
  }

  // Polling para verificar mudanças no QR Code (substitui realtime do Supabase)
  async function escutarQrCode(client: any, usuario_id: number, intervalo: number = 5000) {
    console.log('Escutando atualizações de QR Code via polling...');

    let ultimoQrCode: string | null = null;

    setInterval(async () => {
      try {
        const instance = await prisma.whatsappInstances.findFirst({
          where: { cliente_id: usuario_id },
          select: { qr_code: true }
        });

        if (instance && instance.qr_code !== ultimoQrCode) {
          ultimoQrCode = instance.qr_code;

          if (instance.qr_code === '' || instance.qr_code === null) {
            console.log('Iniciando limpeza de pastas de autenticação...');
            await client.destroy();
            await new Promise(res => setTimeout(res, 5000));
            await deleteFolder('.wwebjs_auth');
            await deleteFolder('.wwebjs_cache');
            client.initialize();
            console.clear();
            console.log('Bot reiniciado para novo login!');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar QR Code:', error);
      }
    }, intervalo);
  }

  return {
    getPrompt,
    getAtividade,
    responderPergunta,
    resolverNumero,
    atualizarQrCode,
    testMensagem,
    formatarNumero,
    marcarEnviada,
    buscarMensagensPendentes,
    iniciarPollingMensagens,
    deleteFolder,
    escutarQrCode,
    getAllUsers,
    atualizarConecao
  };
}




// export { responderPergunta, realtimeSupabase, deleteFolder, escutarQrCode, atualizarQrCode, testMensagem, enviarMensagem, formatarNumero };