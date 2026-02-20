import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { Lead } from '../models/lead';
import RenderContact from './chat/renderContact'
import { useRouter } from 'next/navigation';

type SiderbarProps = {
  leads: Lead[];
  setLead: (lead: Lead) => void;
  setModalOpen: (open: boolean) => void;
}

export default function Siderbar({ leads, setLead, setModalOpen }: SiderbarProps) {

  const [filtro, setFiltro] = useState(0);
  const [filtroNumero, setFiltroNumero] = useState('');
  const router = useRouter()

  const filtros = ['todos', 'fria', 'quente', 'finalizada']

  let leadsFiltradas = filtro !== 0
    ? leads?.filter(item => (item.qualidade)?.toLocaleLowerCase() === filtros[filtro])
    : leads;

  leadsFiltradas = filtroNumero
    ? leadsFiltradas.filter(item => item.numero.includes(filtroNumero))
    : leadsFiltradas;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-screen"
    >

      {/* Left mini bar */}
      <div className="bg-neutral-950 border-r border-neutral-800 flex flex-col items-center py-6 px-3 gap-6">

        <button
          className="text-neutral-500 hover:text-red-400 transition"
          onClick={() => router.push('/')}
        >
          <span className="material-symbols-outlined">
            logout
          </span>
        </button>

        <button
          onClick={() => setModalOpen(true)}
          className="p-3 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition"
        >
          <span className="material-symbols-outlined">
            settings
          </span>
        </button>

      </div>

      {/* Main sidebar */}
      <div className="flex flex-col w-full md:max-w-[420px] border-r border-neutral-800 bg-neutral-900">

        {/* Header */}
        <div className="px-5 py-6 border-b border-neutral-800">
          <h1 className="text-xl font-bold text-white tracking-tight">
            NovusTech
          </h1>
          <p className="text-sm text-neutral-400">
            Gestão inteligente de leads
          </p>
        </div>

        {/* Search */}
        <div className="px-4 py-4 border-b border-neutral-800">
          <input
            type="text"
            placeholder="Buscar número..."
            value={filtroNumero}
            onChange={(e) => setFiltroNumero(e.target.value)}
            className="w-full bg-neutral-800 text-sm text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-purple-600 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 px-4 py-3 border-b border-neutral-800 overflow-x-auto no-scrollbar">
          {filtros.map((item, index) => (
            <button
              key={index}
              onClick={() => setFiltro(index)}
              className={`
                px-3 py-1 text-xs rounded-md capitalize transition
                ${filtro === index
                  ? 'bg-purple-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Leads list */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {leadsFiltradas.length > 0 ? (
            leadsFiltradas.map((item, index) => (
              <div
                key={index}
                onClick={() => setLead(item)}
              >
                <RenderContact lead={item} />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
              Nenhuma lead encontrada
            </div>
          )}
        </div>

      </div>

    </motion.div>
  )
}