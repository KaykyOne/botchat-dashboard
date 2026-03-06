'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface ResultadoProspecccao {
  id: string
  nome: string
  endereco: string
  telefone?: string
  website?: string
  avaliacao: number
  tipo: string
  distancia: number
  adicionado?: boolean
}

export default function ProspeccaoPanel() {
  const [localizacao, setLocalizacao] = useState('')
  const [tipoNegocio, setTipoNegocio] = useState('')
  const [raio, setRaio] = useState(5)
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState<ResultadoProspecccao[]>([])
  const [filtroAvaliacao, setFiltroAvaliacao] = useState(0)

  const tiposNegocio = [
    'Restaurante',
    'Salão de Beleza',
    'Clínica',
    'Imobiliária',
    'Oficina',
    'Academia',
    'Loja de Roupas',
    'Padaria',
    'Farmácia',
    'Outro'
  ]

  const handleBuscar = async () => {
    // Aqui você vai adicionar a lógica da API do Google Maps
    setBuscando(true)
    // setTimeout para simular carregamento
    setTimeout(() => {
      setBuscando(false)
    }, 1000)
  }

  const handleAdicionarLead = (id: string) => {
    // Aqui você vai adicionar a lógica de salvar no Supabase
    setResultados(prev =>
      prev.map(r => r.id === id ? { ...r, adicionado: true } : r)
    )
  }

  return (
    <div className='w-full h-full flex flex-col gap-6'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='space-y-1'
      >
        <h1 className='text-2xl font-bold text-white'>Encontre Novos Leads</h1>
        <p className='text-sm text-neutral-400'>Configure os parâmetros de busca e encontre oportunidades quentinhas</p>
      </motion.div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 h-full'>
        {/* Panel de Busca - Esquerda */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className='border border-neutral-700 bg-neutral-900 p-8 h-fit rounded-lg'
        >
          <h2 className='text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-6'>
            Parâmetros de Busca
          </h2>

          {/* Localização */}
          <div className='space-y-2 mb-6'>
            <label className='text-xs font-semibold text-neutral-300'>
              <span className='material-symbols-outlined text-sm mr-1 align-middle'>location_on</span>
              Localização
            </label>
            <input
              type='text'
              placeholder='Endereço ou cidade'
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className='w-full bg-neutral-800 text-sm text-white px-4 py-3 outline-none border border-neutral-700 hover:border-neutral-600 focus:border-purple-500 transition duration-200'
            />
          </div>

          {/* Tipo de Negócio */}
          <div className='space-y-2 mb-6'>
            <label className='text-xs font-semibold text-neutral-300'>
              <span className='material-symbols-outlined text-sm mr-1 align-middle'>category</span>
              Tipo de Negócio
            </label>
            <select
              value={tipoNegocio}
              onChange={(e) => setTipoNegocio(e.target.value)}
              className='w-full bg-neutral-800 text-sm text-white px-4 py-3 outline-none border border-neutral-700 hover:border-neutral-600 focus:border-purple-500 transition duration-200'
            >
              <option value=''>Selecione uma categoria</option>
              {tiposNegocio.map((tipo, idx) => (
                <option key={idx} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Raio de Busca */}
          <div className='space-y-2 mb-6'>
            <div className='flex items-center justify-between'>
              <label className='text-xs font-semibold text-neutral-300'>
                <span className='material-symbols-outlined text-sm mr-1 align-middle'>radius</span>
                Raio de Busca
              </label>
              <span className='text-sm text-purple-400 font-semibold'>{raio} km</span>
            </div>
            <input
              type='range'
              min='1'
              max='50'
              value={raio}
              onChange={(e) => setRaio(Number(e.target.value))}
              className='w-full'
            />
          </div>

          {/* Avaliação Mínima */}
          <div className='space-y-2 mb-6'>
            <div className='flex items-center justify-between'>
              <label className='text-xs font-semibold text-neutral-300'>
                <span className='material-symbols-outlined text-sm mr-1 align-middle'>star</span>
                Avaliação Mínima
              </label>
              <span className='text-sm text-yellow-400 font-semibold'>{filtroAvaliacao.toFixed(1)}</span>
            </div>
            <input
              type='range'
              min='0'
              max='5'
              step='0.5'
              value={filtroAvaliacao}
              onChange={(e) => setFiltroAvaliacao(Number(e.target.value))}
              className='w-full'
            />
          </div>

          {/* Botão Buscar */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuscar}
            disabled={!localizacao || !tipoNegocio || buscando}
            className='w-full bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-700 text-white font-medium py-3 transition duration-200 flex items-center justify-center gap-2 mt-8 rounded-lg'
          >
            <span className='material-symbols-outlined text-sm'>search</span>
            {buscando ? 'Buscando...' : 'Buscar Leads'}
          </motion.button>
        </motion.div>

        {/* Área de Resultado - Direita */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className='lg:col-span-2 border border-neutral-700 bg-neutral-900 p-8 overflow-hidden flex flex-col rounded-lg'
        >
          <h2 className='text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-6'>
            Resultados da Busca
          </h2>

          {resultados.length === 0 ? (
            <div className='flex-1 flex flex-col items-center justify-center text-neutral-500'>
              <span className='material-symbols-outlined text-4xl mb-4 opacity-50'>place_outline</span>
              <p className='text-sm'>Nenhum resultado ainda</p>
              <p className='text-xs text-neutral-600 mt-2'>Configure a busca e clique em "Buscar Leads"</p>
            </div>
          ) : (
            <div className='overflow-y-auto space-y-3'>
              {resultados.map((resultado, idx) => (
                <motion.div
                  key={resultado.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className='border border-neutral-700 bg-neutral-800 p-5 hover:border-neutral-600 transition duration-200 rounded-lg'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='font-semibold text-white'>{resultado.nome}</h3>
                        <span className='bg-purple-700 text-purple-200 text-xs px-3 py-1 rounded-md'>
                          {resultado.tipo}
                        </span>
                      </div>
                      <p className='text-xs text-neutral-400 mb-2'>{resultado.endereco}</p>
                      <div className='flex items-center gap-4 text-xs text-neutral-500'>
                        {resultado.avaliacao > 0 && (
                          <div className='flex items-center gap-1'>
                            <span className='material-symbols-outlined text-xs text-yellow-500'>star</span>
                            {resultado.avaliacao.toFixed(1)}
                          </div>
                        )}
                        <div className='flex items-center gap-1'>
                          <span className='material-symbols-outlined text-xs'>distance</span>
                          {resultado.distancia} km
                        </div>
                        {resultado.telefone && (
                          <div className='flex items-center gap-1'>
                            <span className='material-symbols-outlined text-xs'>phone</span>
                            {resultado.telefone}
                          </div>
                        )}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAdicionarLead(resultado.id)}
                      className={`px-4 py-2 font-medium text-sm transition duration-200 whitespace-nowrap rounded-lg ${
                        resultado.adicionado
                          ? 'bg-green-700 text-green-200 border border-green-700'
                          : 'bg-purple-700 text-purple-200 border border-purple-700 hover:bg-purple-600'
                      }`}
                    >
                      {resultado.adicionado ? (
                        <>
                          <span className='material-symbols-outlined text-sm align-middle'>check</span>
                          Adicionado
                        </>
                      ) : (
                        <>
                          <span className='material-symbols-outlined text-sm align-middle'>add</span>
                          Adicionar
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Google Maps Integration Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className='hidden lg:block border border-neutral-700 bg-neutral-900 p-8 h-80 rounded-lg'
      >
        <h2 className='text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-4'>
          Mapa de Localização
        </h2>
        <div className='w-full h-full bg-neutral-800 flex items-center justify-center border border-dashed border-neutral-700 rounded-lg'>
          <div className='flex flex-col items-center text-neutral-500'>
            <span className='material-symbols-outlined text-4xl mb-2'>map</span>
            <p className='text-sm'>Integração com Google Maps</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
