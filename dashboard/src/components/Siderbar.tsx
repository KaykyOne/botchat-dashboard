'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { Lead } from '../models/lead';
import { pegarHistorico } from '../hooks/useConfiguracoes';
import { Historico } from '../models';

type SiderbarProps = {
  leads: Lead[];
  setLead: (lead: Lead) => void;
  setModalOpen: (open: boolean) => void;
}

export default function Siderbar({ leads, setLead, setModalOpen }: SiderbarProps) {
  const [filtro, setFiltro] = useState(0);
  const [filtroNumero, setFiltroNumero] = useState('');

  const defaultcss = 'rounded-md p-1 pl-2 pr-2 text-[10px] capitalize font-bold flex itens-center gap-1 juscetify-center';

  const css = {
    fria: {
      css: 'bg-blue-800 ' + defaultcss,
      icone: 'mode_cool',
    },
    quente: {
      css: 'bg-amber-800 ' + defaultcss,
      icone: 'local_fire_department',
    },
    finalizada: {
      css: 'bg-green-800 ' + defaultcss,
      icone: 'check'
    }
  }

  const filtros = ['todos', 'fria', 'quente', 'finalizada']

  // const renderLead = async (item: Lead, index: number) => {
  //   const historico = await pegarHistorico(item.id);
  //   const historicoFiltrado = historico.filter((item: Historico) => item.autor == 'USUARIO');
  //   const ultimaMensagem = historicoFiltrado[historicoFiltrado.length - 1];
  //   const mensagem = ultimaMensagem?.content;

  //   return (
  //     <motion.div
  //       className='flex gap-2 w-full p-2 rounded-md text-white hover:ml-2 transition-all duration-300 cursor-pointer hover:bg-neutral-900 items-start justify-start'
  //       key={item.id}
  //       onClick={() => { setMensagens(item.historico); setLead(item) }}
  //       initial={{ opacity: 0, y: -10 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       transition={{ delay: index * 0.1 }}>
  //       <span className="material-symbols-outlined text-neutral-600 !text-3xl">
  //         account_circle
  //       </span>
  //       <div className='flex flex-col'>
  //         <div className='flex gap-2'>
  //           <h1>{item.numero}</h1>
  //           <div className={css[item.qualidade].css}>
  //             {item.qualidade}
  //             <span className="material-symbols-outlined !text-[14px]">
  //               {css[item.qualidade].icone}
  //             </span>
  //           </div>
  //           {item.ia_ativa && (
  //             <div className="bg-purple-50-500 text-white text-[10px] font-medium px-2 py-1 rounded w-fit">
  //               IA
  //             </div>
  //           )}

  //         </div>
  //         <p>{mensagem?.length > 100 ? mensagem.slice(0, 50) + "..." : mensagem}</p>
  //       </div>
  //     </motion.div>
  //   )
  //   return (<div></div>)
  // }

  let leadsFiltradas = [];
  leadsFiltradas = filtro != 0 ? leads?.filter(item => item.qualidade == filtros[filtro]) : leads;
  leadsFiltradas = filtroNumero != '' ? leadsFiltradas.filter(item => (item.numero).includes(filtroNumero)) : leadsFiltradas;

  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: '100%' }}
      transition={{ delay: 1 * 0.1 }}
      className='flex flex-col gap-2 bg-background w-full md:max-w-[400px] h-full p-6 shadow-2xl'>
      <div className='mt-5 flex flex-col gap-4'>

        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold'>NovusTech</h1>
          <h3>O melhor chatbot do mercado!</h3>
        </div>
        <button className='flex justify-center items-center gap-2 border border-neutral-700 text-neutral-300 px-4 py-3 rounded-xl hover:bg-neutral-800 transition-all duration-200 cursor-pointer' onClick={() => setModalOpen(true)}>
          <span className="material-symbols-outlined ">
            settings
          </span>
          Configuração do Bot
        </button>

        <button className='flex justify-center items-center gap-2 border border-neutral-700 text-neutral-300 px-4 py-3 rounded-xl hover:bg-neutral-800 transition-all duration-200 cursor-pointer' onClick={() => setModalOpen(true)}>
          <span className="material-symbols-outlined ">
            chat_bubble
          </span>
          Testar Bot
        </button>
        {/* <div className='relative group'>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors !text-xl">
            search
          </span>
          <input
            className=" input"
            name="text"
            placeholder="Pesquisar por telefone (somente numeros)"
            type="number"
            value={filtroNumero}
            onChange={(e) => setFiltroNumero(e.target.value)}
          />
        </div> */}


        {/* <details className="flex flex-col gap-4 transition-all duration-300 cursor-pointer text-neutral-500">
          <summary className="opacity-70 hover:opacity-100">Filtros</summary>
          <div className="flex flex-wrap gap-2 text-sm">
            <button
              onClick={() => setFiltro(0)}
              className="flex items-center gap-2 p-2 rounded-lg bg-neutral-700 text-neutral-400 hover:bg-neutral-100 shadow-sm transition cursor-pointer w-full"
            >
              Todas
              <span className="material-symbols-outlined text-neutral-400">
                clear_all
              </span>
            </button>

            <button
              onClick={() => setFiltro(1)}
              className="flex items-center gap-2 p-2 rounded-lg bg-blue-950 text-blue-400 hover:bg-blue-800 shadow-sm transition cursor-pointer w-full"
            >
              Frias
              <span className="material-symbols-outlined text-blue-400">
                ac_unit
              </span>
            </button>

            <button
              onClick={() => setFiltro(2)}
              className="flex items-center gap-2 p-2 rounded-lg bg-amber-900 text-amber-400 hover:bg-amber-700 shadow-sm transition cursor-pointer w-full"
            >
              Quentes
              <span className="material-symbols-outlined text-amber-400">
                local_fire_department
              </span>
            </button>

            <button
              onClick={() => setFiltro(3)}
              className="flex items-center gap-2 p-2 rounded-lg bg-green-900 text-green-400 hover:bg-green-300 shadow-sm transition cursor-pointer w-full"
            >
              Finalizadas
              <span className="material-symbols-outlined text-green-400">
                check_circle
              </span>
            </button>
          </div>
        </details> */}

      </div>


      {/* <div className='flex flex-col gap-1 mt-5 overflow-hidden overflow-y-auto no-scrollbar'>
        {Object.values(leadsFiltradas).map((item, index) =>
          (renderLead(item, index))
        )}
      </div> */}
    </motion.div>
  )
}
