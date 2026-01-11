'use client'
import { useState, useCallback } from "react";
import { supabase } from "./supabase";
import { toast } from "react-toastify";

const usuario_id = 1;

// Custom hook - agora os hooks estão DENTRO de uma função
const useQrCode = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [conectado, setConectado] = useState<boolean>(false);

  const getQrCode = async () => {
    const { data, error } = await supabase
      .from('WhatsappInstances')
      .select('qr_code')
      .eq('cliente_id', usuario_id)
      .eq('status', 'CONNECTING')
      .single();

    if (!data) {
      await verificarConexao();
      return;
    };

    console.log('Buscando..');
    if (error) {
      console.error('Erro ao buscar QR Code:', error);
      return;
    }
    const qr_code = data?.qr_code || null;
    setQrCode(qr_code);
  };

  const verificarConexao = async () => {
    const { data, error } = await supabase
      .from('WhatsappInstances')
      .select('qr_code')
      .eq('cliente_id', usuario_id)
      .eq('status', 'ONLINE')
      .single();

    if (error) {
      console.error('Erro ao verificar conexão:', error);
      return;
    }

    setConectado(!!data);
  }

  const escutarQrCode = useCallback(async () => {
    await getQrCode();
    setTimeout(async () => {
      await getQrCode();
    }, 5000);
  }, []);

  return { qrCode, escutarQrCode, conectado };
}

const pegarHistorico = async (lead_id: number) => {
  const { data, error } = await supabase
    .from('Historico')
    .select('*')
    .eq('lead_id', lead_id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao buscar histórico:', error);
    toast.error('Erro ao buscar histórico');
    return [];
  }
  return data;
}

const pegarPrompt = async () => {
  const { data, error } = await supabase
    .from('Usuarios')
    .select('prompt')
    .eq('id', usuario_id)
    .single();

  if (error) {
    console.error('Erro ao buscar prompt:', error);
    toast.error('Erro ao buscar prompt');
    return null;
  }
  return data?.prompt || null;
}

const atualizarPrompt = async (prompt: string) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .update({ prompt })
    .eq('id', usuario_id);
  if (error) {
    console.error('Erro ao atualizar prompt:', error);
    toast.error('Erro ao atualizar prompt');
    return null;
  }
  return data;;
}

const atualizarAtividadeIa = async (ativo: boolean) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .update({ ia_ativa: ativo })
    .eq('id', usuario_id);
  if (error) {
    console.error('Erro ao atualizar atividade da IA:', error);
    toast.error('Erro ao atualizar atividade da IA');
    return null;
  }
  toast.success('Atividade da IA atualizada com sucesso');
  return data;
}

const getIaAtividade = async () => {
  const { data, error } = await supabase
    .from('Usuarios')
    .select('ia_ativa')
    .eq('id', usuario_id)
    .single();

  return data?.ia_ativa || false;
}

export { useQrCode, pegarHistorico, pegarPrompt, atualizarPrompt, getIaAtividade, atualizarAtividadeIa };