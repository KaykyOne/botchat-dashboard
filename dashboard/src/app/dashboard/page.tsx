'use client'
import React, { useState, useEffect } from 'react'
import { getLeadsMetrics } from '../../hooks/useLead'
import MetricsDashboard from '../../components/MetricsDashboard'
import Loading from '../../components/Loading'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetch = async () => {
      const metricsData = await getLeadsMetrics()
      setMetrics(metricsData)
      setLoading(false)
    }
    fetch()
  }, [])

  return (
    <main className="hidden relative md:flex flex-1 flex-col border-l border-neutral-700">
      {loading ? (<Loading />) : (
        <>
          <div className="px-8 py-8 border-b border-neutral-700">
            <h1 className="text-lg font-medium text-neutral-300">
              Dashboard
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Visão geral de seus leads
            </p>
          </div>

          <div className="flex-1 relative overflow-y-auto">
            <div className='flex flex-col p-8 w-full h-full z-10'>
              <MetricsDashboard metrics={metrics} />
            </div>
          </div>
        </>
      )}
    </main>
  )
}
