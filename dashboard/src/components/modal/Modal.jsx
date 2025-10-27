'use client'

import React, { useEffect, useState } from 'react'
import { buscarConfiguracoes, atualizarConfiguracoes, escutarQrCode, supabase } from '@/hooks/useConfiguracoes'
import QRCode from "react-qr-code";
import Loading from '../Loading';
import { set } from 'date-fns';

export default function Modal({ setModalOpen }) {

    const [configuracoes, setConfiguracoes] = useState({});
    const [loading, setLoading] = useState(false);

    async function buscar() {
        setLoading(true);
        try {
            const data = await buscarConfiguracoes();
            if (data) {
                setConfiguracoes(data.configs);
                // console.log('Configurações buscadas com sucesso:', data.configs);

            }
        } catch (error) {
            console.error('Erro ao buscar configurações:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        buscar()
        const canal = escutarQrCode(buscar)

        // cleanup quando o modal for fechado
        return () => {
            // console.log('❌ Cancelando canal Realtime')
            supabase.removeChannel(canal)
        }
    }, [])

    const renderConfig = (key, value) => {

        if (key === 'qrCode' || key === 'conectado') {
            return null;
        }
        return (
            <div key={key} className='group'>
                <label className='flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2 capitalize'>
                    <span className='w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:bg-purple-500 transition-colors'></span>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {value.length < 10 ? (
                    <input
                        type='text'
                        value={value}
                        onChange={(e) => setConfiguracoes({ ...configuracoes, [key]: e.target.value })}
                        className='w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-neutral-100 placeholder-neutral-500'
                        placeholder={`Digite ${key}...`}
                    />
                )
                    : (
                        <textarea
                            value={value}
                            onChange={(e) => setConfiguracoes({ ...configuracoes, [key]: e.target.value })}
                            className='w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-neutral-100 placeholder-neutral-500 resize-y'
                            placeholder={`Digite ${key}...`}
                            rows={Math.min(Math.ceil(value.length / 43) || 20)}
                        />
                    )}
            </div>
        )
    }

    const saveConfigs = async () => {
        console.log('salvando!');
        await atualizarConfiguracoes(configuracoes);
        console.log(configuracoes);
        await buscar();
    }

    const resetConfig = async () => {
        console.log('reiniciando conexão!');
        await atualizarConfiguracoes({ ...configuracoes, qrCode: '', conectado: true });
        setLoading(true);
        await setTimeout(() => { }, 30000);
        await buscar();
        setLoading(false);
    }

    return (
        <div
            className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4'
            onClick={() => setModalOpen(false)}
        >
            <div
                className='bg-background rounded-3xl border border-neutral-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className='flex items-center justify-between p-6 border-b border-neutral-800'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center'>
                            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                        </div>
                        <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent'>Configurações</h1>
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

                {/* Content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    <div className='space-y-5'>
                        {configuracoes != null && Object.keys(configuracoes).length > 0 && Object.entries(configuracoes).map(([key, value]) => renderConfig(key, value))}
                    </div>


                    {configuracoes.qrCode !== null && (
                        <div className='mt-8 p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-neutral-700'>
                            <div className='flex flex-col items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    <span className="material-symbols-outlined text-green-600">
                                        mobile
                                    </span>
                                    <h2 className='text-xl font-semibold text-neutral-100'>QR Code de Autenticação</h2>
                                </div>
                                <p className='text-sm text-neutral-400 text-center'>Escaneie com seu dispositivo móvel</p>
                                <div className='p-4 rounded-xl shadow-lg'>
                                    {Boolean(configuracoes.conectado) == true && configuracoes.qrCode != "" ? (
                                        <div className='bg-green-600 !text-white font-bold p-4 rounded-xl flex flex-col items-center justify-center gap-2 w-60 h-60'>
                                            <span className="material-symbols-outlined">
                                                check
                                            </span>
                                            <h1 className='!text-white'>Conectado!</h1>
                                        </div>
                                    ) : configuracoes.qrCode ? (
                                        <div className='bg-white'>
                                            <QRCode value={configuracoes.qrCode} size={200} />
                                        </div>
                                    ) : (
                                        <div className='w-full h-full flex flex-col items-center justify-center'>
                                            <div
                                                className="w-10 h-10 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"
                                            ></div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => resetConfig()}
                                    className='bg-green-600 text-white font-bold p-2 w-full rounded-xl hover:bg-green-700 transition-all duration-300 cursor-pointer'>
                                    Reiniciar Conexão
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='p-6 border-t border-neutral-800 bg-neutral-900/50'>
                    <div className='flex gap-3'>
                        <button
                            onClick={() => setModalOpen(false)}
                            className='flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-1 border border-neutral-700 hover:bg-neutral-800 transition-all duration-200 font-medium text-neutral-300 cursor-pointer'
                        >
                            Cancelar
                            <span className="material-symbols-outlined">
                                cancel
                            </span>
                        </button>
                        <button
                            onClick={() => saveConfigs()}
                            className='flex-1 flex items-center justify-center gap-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-500 hover:to-purple-500 transition-all duration-200 font-semibold text-white shadow-lg shadow-purple-900/30 cursor-pointer'
                        >
                            Salvar Alterações
                            <span className="material-symbols-outlined">
                                check_circle
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            {loading && <Loading />}
        </div>

    )
}
