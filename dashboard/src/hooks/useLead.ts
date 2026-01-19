import { supabase } from "./supabase";
import type { Lead } from "../models/index";

const usuario_id = 1;

async function selectAllLeads() {

    let Leads: Lead[] = []

    const { data, error } = await supabase
        .from('Leads')
        .select('*')
        .eq('cliente_id', usuario_id)

    Leads = data as Lead[]
    if (error) {
        console.error(error)
        return Leads
    }
    return Leads
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

export { selectAllLeads, updateLead, deleteLead };
