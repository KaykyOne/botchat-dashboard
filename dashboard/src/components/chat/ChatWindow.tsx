'use client'
import React, { useState, useEffect } from 'react'
import { Lead } from '../../models/lead'
import { selectHistory } from '../../hooks/useLead'
import { motion } from 'framer-motion'
import { formatNumber } from '../../utils/formats'

type ChatWindowProps = {
  lead: Lead
  onClose: () => void
}

export default function ChatWindow({ lead, onClose }: ChatWindowProps) {
  const [mensagens, setMensagens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [novaMsg, setNovaMsg] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const historico = await selectHistory(lead.id)
      setMensagens(historico || [])
      setLoading(false)
    }
    fetch()
  }, [lead.id])

  const handleEnviar = async () => {
    if (!novaMsg.trim()) return
    // TODO: implementar envio de mensagem
    setNovaMsg('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 flex-col border-l border-neutral-700 bg-neutral-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600 flex items-center justify-center text-white font-semibold rounded-lg">
            {lead.numero?.slice(-2)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {formatNumber(lead.numero)}
            </h2>
            <p className="text-xs text-neutral-500">
              {lead.interesse || 'Sem interesse definido'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-800 transition duration-200 rounded-lg"
        >
          <span className="material-symbols-outlined text-neutral-400">close</span>
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full text-neutral-500">
            Carregando conversa...
          </div>
        ) : mensagens.length > 0 ? (
          mensagens.map((msg, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <p className="text-xs text-neutral-400">{msg.autor}</p>
              <div className="bg-neutral-800 p-4 rounded-lg text-sm text-neutral-200">
                {msg.mensagem}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
            Nenhuma mensagem ainda
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-neutral-700 p-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Digite uma mensagem..."
            value={novaMsg}
            onChange={(e) => setNovaMsg(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEnviar()}
            className="flex-1 bg-neutral-800 text-sm text-white px-4 py-3 outline-none border border-neutral-700 hover:border-neutral-600 focus:border-purple-500 transition duration-200 rounded-lg"
          />
          <button
            onClick={handleEnviar}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium transition duration-200 rounded-lg"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
