'use client'

import React, { useEffect, useState } from 'react'
import {
    useQrCode, atualizarPrompt, pegarPrompt,
    getIaAtividade, atualizarAtividadeIa,
    desconectar
} from '../../hooks/useConfiguracoes';
import QRCode from "react-qr-code";
import InternalLoading from '../InternalLoading';
import { toast } from 'react-toastify';

type ModalProps = {
    setModalOpen: any;
};

export default function Modal({ setModalOpen }: ModalProps) {

    const [loading, setLoading] = useState(true);
    const { qrCode, getQrCode, conectado } = useQrCode();
    const [promptAntesAtt, setPromptAntesAtt] = useState('');
    const [prompt, setPrompt] = useState('');
    const [iaAtiva, setIaAtiva] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const atividade = await getIaAtividade();
            setIaAtiva(atividade);

            const res = await pegarPrompt();
            setPromptAntesAtt(res);
            setPrompt(res);

            await getQrCode("BAiLEYS");
            setLoading(false);
        };
        fetch();
    }, []);

    const attPrompt = async () => {
        setLoading(true);
        await atualizarPrompt(prompt);
        setPromptAntesAtt(prompt);
        setLoading(false);
    };

    const alterarIaAtiva = async (check: boolean) => {
        await atualizarAtividadeIa(check);
        setIaAtiva(check);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(prompt);
        toast.success('Prompt copiado!');
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4"
            onClick={() => setModalOpen(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-950 border border-neutral-800 rounded-md w-full relative max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)]"
            >

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
                    <h1 className="text-xl font-semibold text-white">
                        Configurações
                    </h1>

                    <button
                        onClick={() => setModalOpen(false)}
                        className="w-9 h-9 rounded-md hover:bg-neutral-800 flex items-center justify-center transition"
                    >
                        <span className="material-symbols-outlined text-neutral-400">
                            close
                        </span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-sm uppercase tracking-wider text-neutral-400">
                            Sistema
                        </h2>

                        <div className="bg-neutral-900 border border-neutral-800 rounded-md p-6 flex justify-between items-center">
                            <div>
                                <p className="text-white text-sm font-medium">
                                    IA Ativa
                                </p>
                                <p className="text-neutral-500 text-xs">
                                    Permite respostas automáticas.
                                </p>
                            </div>

                            <button
                                onClick={() => alterarIaAtiva(!iaAtiva)}
                                className={`
                                    w-12 h-6 flex items-center rounded-md transition
                                    ${iaAtiva ? 'bg-purple-600 justify-end' : 'bg-neutral-700 justify-start'}
                                `}
                            >
                                <div className="w-5 h-5 bg-white rounded-md m-0.5"></div>
                            </button>
                        </div>
                    </section>

                    {/* PROMPT SECTION */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm uppercase tracking-wider text-neutral-400">
                                Prompt da IA
                            </h2>

                            <button
                                onClick={copyToClipboard}
                                className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1 rounded-md transition"
                            >
                                Copiar
                            </button>
                        </div>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-4 text-sm text-neutral-200 min-h-[250px] focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                        />

                        {prompt !== promptAntesAtt && (
                            <button
                                onClick={attPrompt}
                                className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-md font-medium transition"
                            >
                                Salvar alterações
                            </button>
                        )}
                    </section>

                    {/* QR SECTION */}
                    <section className="space-y-4">
                        <h2 className="text-sm uppercase tracking-wider text-neutral-400">
                            Conexão WhatsApp
                        </h2>

                        <div className="bg-neutral-900 border border-neutral-800 rounded-md p-6 flex flex-col items-center gap-4">

                            {conectado ? (
                                <>
                                    <div className="w-16 h-16 rounded-md bg-green-500/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-400 text-3xl">
                                            check_circle
                                        </span>
                                    </div>
                                    <p className="text-green-400 font-medium">
                                        Conectado
                                    </p>
                                    <button
                                        onClick={async () => await desconectar()}
                                        className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md text-sm transition"
                                    >
                                        Desconectar
                                    </button>
                                </>
                            ) : (
                                qrCode ? (
                                    <QRCode value={qrCode} size={200} />
                                ) : (
                                    <p className="text-neutral-500 text-sm">
                                        Gerando QR Code...
                                    </p>
                                )
                            )}

                        </div>
                    </section>
                </div>

                {loading && <InternalLoading />}
            </div>
        </div>
    )
}