'use client'
import React, { useState, useEffect, use } from 'react'
import { selectAllLeads, selectHistory } from '../../hooks/useLead'
import Siderbar from '../../components/Siderbar'
import Modal from '../../components/modal/Modal'
import { Historico, Lead, Mensagem } from '../../models/index';
import { format } from 'date-fns'

export default function Page() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [mensagens, setMensagens] = useState<Historico[]>([])
  const [lead, setLead] = useState<Lead | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const diasJaCarregados: string[] = []
  // Busca todos os leads ao carregar

  // const buscar = async () => {
  //   const data = await selectAllLeads()
  //   console.log(data)
  //   setLeads(data || [])
  // }

  useEffect(() => {
    const fetch = async () => {
      const data = await selectAllLeads()
      setLeads(data || [])
    }

    fetch()
  }, [])

  useEffect(() => {
    const fetchMensagens = async () => {
      if (lead) {
        const data: Historico[] = await selectHistory(lead.id)
        setMensagens(data || [])
      }
    }

    fetchMensagens()
  }, [lead])

  useEffect(() => {
    const container: HTMLElement = document.getElementById('mensagens-container') as HTMLElement;
    if (container?.scrollHeight > 0) {
      container.scrollTo(0, container.scrollHeight);
    }
  }, [mensagens])
  // Renderiza cada mensagem
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

  return (
    <div className='flex flex-col w-screen h-screen overflow-hidden'>
      <div className='flex w-full h-full'>
        <Siderbar leads={leads} setLead={setLead} setModalOpen={setModalOpen} />
        <div className='flex-col w-full relative items-center hidden md:flex justify-center bg-neutral-900'>
          <img src={'/bg-robots.png'} className='w-screen h-screen absolute z-0 opacity-10' />
          <div className='flex flex-col p-10 gap-3 w-full h-full overflow-y-auto z-10' id='mensagens-container'>
            {mensagens.map(renderMensagem)}
          </div>
        </div>
      </div>

      {modalOpen && <Modal setModalOpen={setModalOpen} />}
    </div>
  )
}
