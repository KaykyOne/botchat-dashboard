'use client'

import React, { useEffect, useState } from 'react'
import {
    useQrCode, atualizarPrompt, pegarPrompt, getIaAtividade, atualizarAtividadeIa, desconectar, conectar
} from '../../hooks/useConfiguracoes';
import QRCode from "react-qr-code";
import InternalLoading from '../InternalLoading';
import { toast } from 'react-toastify';

type ModalProps = {
    setModalOpen: any;
};

export default function Modal({ setModalOpen }: ModalProps) {

    // const [configuracoes, setConfiguracoes] = useState({});
    const [loading, setLoading] = useState(true);
    const { qrCode, getQrCode, conectado } = useQrCode();
    const [promptAntesAtt, setPromptAntesAtt] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [iaAtiva, setIaAtiva] = useState<boolean>(false);

    const startQrInterval = async () => {
        await getQrCode("BAiLEYS");
        const id = setInterval(async () => {
            await getQrCode("BAiLEYS");
        }, 5000);
        return id;
    };

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const atividade = await getIaAtividade();
            setIaAtiva(atividade);
            const res = await pegarPrompt();
            setPromptAntesAtt(res);
            setPrompt(res);
        }
        fetch();
        const inter = startQrInterval();
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [iaAtiva, qrCode, conectado]);

    const HeaderTitle = () => {
        return (
            <div className='flex items-center justify-between p-6 border-b border-neutral-800'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-primary to-secundary rounded-lg flex items-center justify-center'>
                        <span className="material-symbols-outlined">
                            settings
                        </span>
                    </div>
                    <h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-secundary bg-clip-text text-transparent'>Configurações</h1>
                </div>
                <button
                    onClick={() => setModalOpen(false)}
                    className='w-9 h-9 rounded-full hover:bg-neutral-800 flex items-center justify-center transition-all duration-200 group'
                    aria-label='Fechar'
                >
                    <svg className='w-5 h-5 text-neutral-400 group-hover:text-red-500 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                </button>
            </div>
        )
    }

    const FooterButtons = () => {
        return (
            <div className='p-6 border-t border-neutral-800 bg-neutral-900/50'>
                <div className='flex flex-col gap-3'>
                    <button
                        onClick={() => setModalOpen(false)}
                        className='flex justify-center items-center gap-2 border border-neutral-700 text-neutral-300 px-4 py-3 rounded-xl hover:bg-neutral-800 transition-all duration-200 cursor-pointer'
                    >
                        Cancelar
                        <span className="material-symbols-outlined">
                            cancel
                        </span>
                    </button>
                </div>
            </div>
        )
    }

    const renderConectado = () => {
        if (conectado) {
            return (
                <div className='flex flex-col flex-1 bg-green-600 border-2 border-green-500 w-full h-full rounded-lg justify-center items-center p-4 animate-pulse'>
                    <span className="material-symbols-outlined !text-4xl !text-green-200">
                        check_box
                    </span>
                    <h1 className='!text-green-200 text-2xl'>Conectado</h1>
                    <button
                        onClick={async () => await desconectar()}
                        className='button w-full bg-red-700'>
                        Desconectar
                    </button>
                </div>
            );
        } else {
            if (qrCode === null) {
                return <h1>Buscando QR Code...</h1>;
            } else {
                return (
                    <div className='flex flex-col gap-2 w-full justify-center items-center bg-neutral-800 p-4 rounded-2xl'>
                        {<QRCode value={qrCode || ''} size={200} />}
                    </div >
                );
            }
        }
    }

    const attPrompt = async (novoPrompt: string) => {
        setLoading(true);
        await atualizarPrompt(novoPrompt);
        setPromptAntesAtt(novoPrompt);
        setPrompt(novoPrompt);
        setLoading(false);
    }

    const alterarIaAtiva = async (check: boolean) => {
        await atualizarAtividadeIa(check);
        setIaAtiva(check);
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info('Prompt copiado para a área de transferência!');
    }

    return (
        <div
            className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4'
            onClick={() => setModalOpen(false)}
        >
            <div
                className='bg-background rounded-3xl border border-neutral-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden  flex flex-col relative'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <HeaderTitle />
                <div className='flex justify-start items-center flex-col p-4 gap-4 overflow-y-scroll no-scrollbar flex-1 w-full pt-20 md:pt-5'>
                    <div className='flex flex-col w-full gap-2'>

                        <div className='flex gap-3 items-center'>
                            <h1>Prompt</h1>
                            <button className='flex rounded-md p-2 bg-neutral-700 text-neutral-300 cursor-pointer' onClick={() => copyToClipboard(prompt)}>
                                <span className="material-symbols-outlined">
                                    copy_all
                                </span>
                            </button>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)} className='w-full border border-neutral-700 rounded-lg p-2 min-h-[50vh]' />

                        {prompt !== promptAntesAtt && (
                            <button
                                onClick={async () => await attPrompt(prompt)}
                                className='bg-green-800 gap-3 flex justify-center items-center p-2 w-full rounded-lg hover:opacity-80'
                            >
                                Salvar Alterações
                                <span className="material-symbols-outlined">
                                    done_all
                                </span>
                            </button>
                        )}
                    </div>

                    <div className='flex flex-col w-full gap-2'>
                        <h1>QrCode</h1>
                        {renderConectado()}
                    </div>

                    <div className='flex flex-col w-full gap-2'>
                        <h1>Configurações de Atividade</h1>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 justify-center items-center w-full'>
                            <div className='flex col-span-1 flex-1 flex-col justify-center items-center gap-1 border border-neutral-700 rounded-2xl w-full p-4'>
                                <h1>Ativo</h1>
                                <p className='text-neutral-400 text-center text-[10px]'>Isso mostra se você está ativo no sistema!</p>
                                <input type="checkbox" checked={conectado} readOnly className='w-6 h-6 opacity-50' />
                            </div>
                            <div className='flex col-span-1 flex-1 flex-col justify-center items-center gap-1 border border-neutral-700 rounded-2xl w-full p-4'>
                                <h1>IA Ativa</h1>
                                <p className='text-neutral-400 text-center text-[10px]'>Isso mostra se a IA está ativa no sistema!</p>
                                <input type="checkbox" checked={iaAtiva} onChange={(e) => alterarIaAtiva(e.target.checked)} className='w-6 h-6' />
                            </div>
                        </div>
                    </div>


                </div>


                {/* Footer */}
                <FooterButtons />
                {loading && <InternalLoading />}
            </div>
        </div>

    )

}
