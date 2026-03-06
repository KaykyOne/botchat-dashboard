import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { Lead } from '../models/lead';
import RenderContact from './chat/renderContact'
import { useRouter, usePathname } from 'next/navigation';

type SiderbarProps = {
  leads: Lead[];
  setLead: (lead: Lead) => void;
  setModalOpen: (open: boolean) => void;
}

export default function Siderbar({ leads, setLead, setModalOpen }: SiderbarProps) {

  const [filtro, setFiltro] = useState(0);
  const [filtroNumero, setFiltroNumero] = useState('');
  const router = useRouter()
  const pathname = usePathname()
  const filtros = ['todos', 'fria', 'quente', 'finalizada']

  let leadsFiltradas = filtro !== 0
    ? leads?.filter(item => (item.qualidade)?.toLocaleLowerCase() === filtros[filtro])
    : leads;

  leadsFiltradas = filtroNumero
    ? leadsFiltradas.filter(item => item.numero.includes(filtroNumero))
    : leadsFiltradas;

  const contatosVisiveis = pathname == '/dashboard/'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-screen"
    >

      {/* Left mini bar */}
      <div className="bg-neutral-950 border-r border-neutral-700 flex flex-col items-center py-8 px-4 gap-8">

        <button
          className="text-neutral-500 hover:text-red-500 transition duration-200"
          onClick={() => router.push('/')}
        >
          <span className="material-symbols-outlined text-24">
            logout
          </span>
        </button>

        <button
          onClick={() => setModalOpen(true)}
          className="p-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-300 transition duration-200 flex justify-center items-center cursor-pointer rounded-lg"
        >
          <span className="material-symbols-outlined text-24">
            settings
          </span>
        </button>

        <button
          onClick={() => { setLead(undefined as any); router.push('/dashboard') }}
          className="p-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-300 transition duration-200 flex justify-center items-center cursor-pointer rounded-lg"
        >
          <span className="material-symbols-outlined text-24">
            dashboard
          </span>
        </button>

        <button
          onClick={() => router.push('/dashboard/prospeccao')}
          className="p-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-300 transition duration-200 flex justify-center items-center cursor-pointer rounded-lg"
          title="Prospecção"
        >
          <span className="material-symbols-outlined text-24">
            search_insights
          </span>
        </button>

      </div>


      {/* Main sidebar */}
      {contatosVisiveis && (
        <div className="flex flex-col w-full md:max-w-[420px] border-r border-neutral-700 bg-neutral-900">

          {/* Header */}
          <div className="px-6 py-8 border-b border-neutral-700">
            <h1 className="text-2xl font-bold text-white mb-2">
              NovusTech
            </h1>
            <p className="text-sm text-neutral-500">
              Gestão de leads
            </p>
          </div>

          {/* Search */}
          <div className="px-6 py-6 border-b border-neutral-700">
            <input
              type="text"
              placeholder="Buscar número"
              value={filtroNumero}
              onChange={(e) => setFiltroNumero(e.target.value)}
              className="w-full bg-neutral-800 text-sm text-white px-4 py-3 outline-none border border-neutral-700 hover:border-neutral-600 focus:border-purple-500 transition duration-200 rounded-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 px-6 py-6 border-b border-neutral-700 overflow-x-auto no-scrollbar">
            {filtros.map((item, index) => (
              <button
                key={index}
                onClick={() => setFiltro(index)}
                className={`
                px-3 py-2 text-xs font-medium capitalize transition duration-200 rounded-lg
                ${filtro === index
                    ? 'bg-purple-600 text-white border border-purple-600'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600'
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
                Nenhuma lead
              </div>
            )}
          </div>

        </div>
      )}

    </motion.div>
  )
}