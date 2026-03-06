'use client'
import React, { useState, useEffect } from 'react'
import Siderbar from '../../components/Siderbar'
import Modal from '../../components/modal/Modal'
import ChatWindow from '../../components/chat/ChatWindow'
import { selectAllLeads } from '../../hooks/useLead'
import { Lead } from '../../models/index'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [lead, setLead] = useState<Lead | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetch = async () => {
      const data = await selectAllLeads()
      setLeads(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const handleSetLead = (selectedLead: Lead | undefined) => {
    setLead(selectedLead)
  }

  return (
    <div className="flex h-screen w-screen bg-neutral-900 text-neutral-100">
      <Siderbar
        leads={leads}
        setLead={handleSetLead}
        setModalOpen={setModalOpen}
      />

      {lead ? (
        <ChatWindow lead={lead} onClose={() => handleSetLead(undefined)} />
      ) : (
        <>
          {children}
        </>
      )}

      {modalOpen && <Modal setModalOpen={setModalOpen} />}
    </div>
  )
}
