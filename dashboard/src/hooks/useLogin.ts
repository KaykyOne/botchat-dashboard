import { toast } from "react-toastify";
import { supabase } from "./supabase";


const login = async (email: string, password: string, saveDados: boolean) => {

    if (!email || !password) {
        toast.error('Preencha todos os campos!');
        return;
    }

    const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', password)
        .single();
    if (error) {
        console.log(error);
        toast.error('Usuário ou senha incorretos!');
        return false;
    }
    salvarDados(email, password, saveDados);
    return data;
}

function salvarDados(email: string, password: string, saveDados: boolean) {
    if ((!email || !password) && !saveDados) return;
    localStorage.setItem('email', email);
    localStorage.setItem('senha', password);
}

export { login, salvarDados };
