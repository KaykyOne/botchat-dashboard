'use client'
import React, { useState, useEffect } from 'react'
import { selectAllLeads, } from '../../hooks/useLead'
import Siderbar from '../../components/Siderbar'
import Header from '../../components/header/Header'
import Modal from '../../components/modal/Modal'
import { Historico, Lead } from '../../models/index';

export default function Page() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [mensagens, setMensagens] = useState([])
  const [lead, setLead] = useState<Lead | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)

  // Busca todos os leads ao carregar

  // const buscar = async () => {
  //   const data = await selectAllLeads()
  //   console.log(data)
  //   setLeads(data || [])
  // }

  useEffect(() => {
    const fetch = async () => {
      const data = await selectAllLeads()
      console.log(data)
      setLeads(data || [])
    }

    fetch()
  }, [])
  useEffect(() => {

    const container: HTMLElement = document.getElementById('mensagens-container') as HTMLElement;
    if (container?.scrollHeight > 0) {
      container.scrollTo(0, container.scrollHeight);
    }
  }, [mensagens])
  // Renderiza cada mensagem
  const renderMensagem = (item: Historico, index: number) => {
    return (
      <div
        key={index}
        className={`w-full flex ${item.autor === 'LEAD' ? 'justify-start' : 'justify-end'
          }`}
      >
        <div
          className={`rounded-md p-3 pl-5 pr-5 w-fit max-w-[600px] transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:shadow-2xl ${item.autor === 'LEAD' ? 'bg-neutral-800' : 'bg-green-800'
            }`}
        >
          <h1>{item.autor === 'LEAD' ? 'Cliente' : 'Assistente IA'}</h1>
          {item.mensagem}
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col w-screen h-screen overflow-hidden'>
      <Header item={lead} buscar={() => {return;}} />

      <div className='flex w-full h-full'>
        <Siderbar leads={leads} setLead={setLead} setModalOpen={setModalOpen} />
        <div className='flex-col w-full relative items-center hidden md:flex'>
          <div className='flex flex-col p-10 gap-3 w-full overflow-y-auto' id='mensagens-container'>
            {mensagens.map(renderMensagem)}
          </div>
        </div>
      </div>

      {modalOpen && <Modal setModalOpen={setModalOpen} />}
    </div>
  )
}
