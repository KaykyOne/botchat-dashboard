'use client'
import React, { useState } from 'react'
import ProspeccaoPanel from '../../../components/ProspeccaoPanel'
import Loading from '../../../components/Loading'

export default function ProspeccaoPage() {
  const [loading, setLoading] = useState(false)

  return (
    <main className="hidden relative md:flex flex-1 flex-col border-l border-neutral-700">
      {loading ? (<Loading />) : (
        <>
          <div className="px-8 py-8 border-b border-neutral-700">
            <h1 className="text-lg font-medium text-neutral-300">
              Prospecção
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Busque novos leads através do Google Maps
            </p>
          </div>

          <div className="flex-1 relative overflow-y-auto">
            <img src={'bg-robots.png'} className='w-screen h-screen absolute z-0 opacity-10' />
            <div className='flex flex-col p-8 w-full h-full z-10'>
              <ProspeccaoPanel />
            </div>
          </div>
        </>
      )}
    </main>
  )
}
