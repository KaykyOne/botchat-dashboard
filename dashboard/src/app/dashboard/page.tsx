'use client'
import React, { useState, useEffect, use } from 'react'
import { selectAllLeads, selectHistory } from '../../hooks/useLead'
import Siderbar from '../../components/Siderbar'
import Modal from '../../components/modal/Modal'
import { Historico, Lead, Mensagem } from '../../models/index';
import { format, set } from 'date-fns'
import RenderLeads from './renderLeads'
import Loading from '../../components/Loading'

export default function Page() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [mensagens, setMensagens] = useState<Historico[]>([])
  const [lead, setLead] = useState<Lead | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const diasJaCarregados: string[] = []
  const [loading, setLoading] = useState(false)
  // Busca todos os leads ao carregar

  // const buscar = async () => {
  //   const data = await selectAllLeads()
  //   console.log(data)
  //   setLeads(data || [])
  // }

  useEffect(() => {
    setLoading(true)
    const fetch = async () => {
      const data = await selectAllLeads()
      setLeads(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchMensagens = async () => {
      if (lead) {
        const data: Historico[] = await selectHistory(lead.id)
        setMensagens(data || [])
      }
      setLoading(false)
    }

    if (!lead) setMensagens([]);
    fetchMensagens()
  }, [lead])

  useEffect(() => {
    const container: HTMLElement = document.getElementById('mensagens-container') as HTMLElement;
    if (container?.scrollHeight > 0) {
      container.scrollTo(0, container.scrollHeight);
    }
  }, [mensagens])

  const renderMensagem = (item: Historico, index: number) => {

    const autor = (item.autor).toLocaleLowerCase();
    const mensagem = item.mensagem;
    const hora = format(new Date(item.criado_em), 'HH:mm')
    const dia = format(new Date(item.criado_em), 'dd/MM/yyyy')
    const diasAntesDeAtualizar = diasJaCarregados;
    const test = diasAntesDeAtualizar.find(d => d == dia);
    diasJaCarregados.push(dia)
    return (
      <div key={index} className='w-full flex-col items-center'>
        {!test && <p className='text-sm text-gray-400 w-full text-center my-4'>{dia}</p>}
        <div
          key={index}
          className={`w-full flex ${(autor) === 'lead' ? 'justify-start' : 'justify-end'
            }`}
        >
          <div
            className={`rounded-md p-3 pl-5 pr-5 w-fit max-w-[600px] transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:shadow-2xl ${autor === 'lead' ? 'bg-neutral-800' : 'bg-green-800'
              }`}
          >
            <h1>{autor === 'lead' ? 'Cliente' : 'Assistente IA'}</h1>
            {mensagem}
            <p className='text-sm text-gray-400 w-full text-end mt-4'>{hora}</p>
          </div>
        </div>
      </div>

    )
  }

  if (!lead) {
    return (
      <div className="flex h-screen w-screen bg-neutral-900 text-neutral-100">

        <Siderbar
          leads={leads}
          setLead={setLead}
          setModalOpen={setModalOpen}
        />


        <main className="hidden relative md:flex flex-1 flex-col border-l border-neutral-800">

          {loading ? (<Loading />) : (
            <>
              <div className="px-8 py-6 border-b border-neutral-800">
                <h1 className="text-lg font-medium text-neutral-300">
                  Dashboard
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  Selecione um lead para visualizar a conversa
                </p>
              </div>

              <div className="flex-1 relative overflow-y-auto">
                <img src={'/bg-robots.png'} className='w-screen h-screen absolute z-0 opacity-10' />
                <div className='flex p-8 w-full h-full z-10'>
                  <RenderLeads leads={leads} />
                </div>
              </div>
            </>
          )}
        </main>


        {modalOpen && <Modal setModalOpen={setModalOpen} />}
      </div>
    )
  }

  return (
    <div className='flex flex-col w-screen h-screen overflow-hidden'>
      <div className='flex w-full h-full'>
        <Siderbar leads={leads} setLead={setLead} setModalOpen={setModalOpen} />
        <div className='flex-col w-full relative items-center hidden md:flex justify-center bg-neutral-900'>
          <img src={'/bg-robots.png'} className='w-screen h-screen absolute z-0 opacity-10' />
          <div className='flex flex-col p-10 gap-3 w-full h-full overflow-y-auto z-10 relative' id='mensagens-container'>
            {!loading ? mensagens.map(renderMensagem) : <Loading />}
          </div>
        </div>
      </div>

      {modalOpen && <Modal setModalOpen={setModalOpen} />}
    </div>
  );
}
