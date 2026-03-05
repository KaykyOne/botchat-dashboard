'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface MetricsData {
  categorias: {
    fria: number
    quente: number
    finalizada: number
  }
  percentuais: {
    fria: number
    quente: number
    finalizada: number
  }
  mesesData: { [key: string]: number }
  total: number
}

export default function MetricsDashboard({ metrics }: { metrics: MetricsData | null }) {
  if (!metrics) {
    return null
  }

  const categoriaConfig = [
    {
      label: 'Fria',
      value: metrics.categorias.fria,
      percentual: metrics.percentuais.fria,
      color: 'from-blue-600 to-blue-400',
      bgColor: 'bg-blue-950/30',
      borderColor: 'border-blue-800',
      textColor: 'text-blue-400'
    },
    {
      label: 'Quente',
      value: metrics.categorias.quente,
      percentual: metrics.percentuais.quente,
      color: 'from-orange-600 to-orange-400',
      bgColor: 'bg-orange-950/30',
      borderColor: 'border-orange-800',
      textColor: 'text-orange-400'
    },
    {
      label: 'Fechado',
      value: metrics.categorias.finalizada,
      percentual: metrics.percentuais.finalizada,
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-950/30',
      borderColor: 'border-green-800',
      textColor: 'text-green-400'
    }
  ]

  const maxValue = Math.max(...Object.values(metrics.mesesData))

  return (
    <div className='w-full h-full flex flex-col gap-6 pb-6'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='space-y-1'
      >
        <h1 className='text-2xl font-bold text-white'>Métricas de Leads</h1>
        <p className='text-sm text-neutral-400'>Total de {metrics.total} leads registrados</p>
      </motion.div>

      {/* Categoria Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-4'
      >
        {categoriaConfig.map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
            className={`border ${cat.borderColor} ${cat.bgColor} p-8`}
          >
            {/* Category Header */}
            <div className='flex items-center justify-between mb-4'>
              <h3 className={`text-sm font-semibold uppercase tracking-widest ${cat.textColor}`}>
                {cat.label}
              </h3>
            </div>

            {/* Value and Percentage */}
            <div className='space-y-4'>
              <div>
                <p className='text-4xl font-bold text-white'>{cat.value}</p>
                <p className={`text-sm ${cat.textColor} mt-2`}>{cat.percentual}% do total</p>
              </div>

              {/* Progress Bar */}
              <div className='w-full bg-neutral-800 h-2 overflow-hidden'>
                <motion.div
                  className={`h-full bg-gradient-to-r ${cat.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentual}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Monthly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className='border border-neutral-700 bg-neutral-900 p-8 rounded-lg'
      >
        <h3 className='text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-6'>
          Leads por Mês (12 últimos meses)
        </h3>

        {/* Chart Container */}
        <div className='flex items-end gap-3 h-48 pb-4'>
          {Object.entries(metrics.mesesData).map(([mes, valor]) => (
            <motion.div
              key={mes}
              className='flex-1 flex flex-col items-center justify-end gap-2 group'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Bar */}
              <div className='w-full bg-gradient-to-t from-purple-600 to-purple-400 transition-all duration-300 group-hover:from-purple-500 group-hover:to-purple-300'
                style={{
                  height: maxValue > 0 ? `${(valor / maxValue) * 100}%` : '0%',
                  minHeight: valor > 0 ? '4px' : '0px'
                }}
              />

              {/* Value Tooltip */}
              {valor > 0 && (
                <div className='text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors'>
                  {valor}
                </div>
              )}

              {/* Label */}
              <p className='text-xs text-neutral-500 text-center leading-tight whitespace-nowrap'>
                {mes}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.35 }}
        className='flex gap-4 text-sm text-neutral-400'
      >
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-blue-600' />
          <span>Fria</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-amber-500' />
          <span>Quente</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-green-600' />
          <span>Fechado</span>
        </div>
      </motion.div>
    </div>
  )
}
