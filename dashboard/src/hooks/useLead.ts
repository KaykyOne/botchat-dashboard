import { supabase } from "./supabase";
import type { Lead, Historico } from "../models/index";

async function selectAllLeads() {
    const usuario_id = localStorage.getItem('id_do_usuario');

    let Leads: Lead[] = []

    const { data, error } = await supabase
        .from('Leads')
        .select('*')
        .eq('cliente_id', usuario_id);

    Leads = data as Lead[]
    if (error) {
        console.error(error)
        return Leads
    }
    return Leads
}

async function selectHistory(lead_id: number) {

    let historico: Historico[] = []

    const { data, error } = await supabase
        .from('Historico')
        .select('*')
        .eq('lead_id', lead_id);

    historico = data as Historico[]
    if (error) {
        console.error(error)
        return historico
    }
    return historico
}

async function getLeadsMetrics() {
    const usuario_id = localStorage.getItem('id_do_usuario');

    const { data, error } = await supabase
        .from('Leads')
        .select('id, created_at, qualidade')
        .eq('cliente_id', usuario_id);

    if (error) {
        console.error(error)
        return null
    }

    const leads = data as any[]

    // Métricas por categoria
    const categorias = {
        fria: 0,
        quente: 0,
        finalizada: 0
    }

    leads.forEach(lead => {
        const qualidade = (lead.qualidade || '').toLowerCase()
        if (qualidade === 'fria') categorias.fria++
        else if (qualidade === 'quente') categorias.quente++
        else if (qualidade === 'finalizada') categorias.finalizada++
    })

    const total = leads.length
    const percentuais = {
        fria: total > 0 ? Math.round((categorias.fria / total) * 100) : 0,
        quente: total > 0 ? Math.round((categorias.quente / total) * 100) : 0,
        finalizada: total > 0 ? Math.round((categorias.finalizada / total) * 100) : 0
    }

    // Métricas mensais (últimos 12 meses)
    const mesesData: { [key: string]: number } = {}
    const hoje = new Date()

    for (let i = 11; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
        const chave = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
        mesesData[chave] = 0
    }

    leads.forEach(lead => {
        const dataCriacao = new Date(lead.created_at)
        const chave = dataCriacao.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
        if (mesesData[chave] !== undefined) {
            mesesData[chave]++
        }
    })

    return {
        categorias,
        percentuais,
        mesesData,
        total
    }
}

async function updateLead(id:number, lead: Lead) {
    const { data, error } = await supabase
        .from('Leads')
        .update(lead)
        .eq('id', id)

    if (error) {
        console.error(error)
        return []
    }
    return data
}

async function deleteLead(id:number) {
    const { data, error } = await supabase
        .from('Leads')
        .delete()
        .eq('id', id)

    if (error) {
        console.error(error)
        return []
    }
    return data
}

export { selectAllLeads, updateLead, deleteLead, selectHistory, getLeadsMetrics };
