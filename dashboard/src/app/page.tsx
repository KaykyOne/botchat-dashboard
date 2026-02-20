"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '../hooks/useLogin'
import { ToastContainer } from 'react-toastify'

export default function Page() {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [saveDados, setSalvarDados] = useState(false)

  async function handleClick() {
    if (!email || !password) return
    setLoading(true)
    const ok = await login(email, password, saveDados)
    if (ok) router.push('/dashboard')
    setLoading(false)
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('email')
    const savedPassword = localStorage.getItem('senha')
    if (savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setSalvarDados(true)
    }
  }, [])

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-neutral-950 overflow-hidden">

      {/* Background spotlight */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-md blur-3xl -top-40 -right-40" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 rounded-md blur-3xl -bottom-40 -left-40" />

      <div className="relative w-full max-w-md px-6">

        <div className="bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-md shadow-[0_0_60px_rgba(0,0,0,0.6)] p-8 space-y-8">

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-neutral-400">
              Acesse sua central de gestão de leads
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-5">

            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-500 transition">
                mail
              </span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              />
            </div>

            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-500 transition">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-3 pl-12 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {/* Remember */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-400">
                <input
                  type="checkbox"
                  checked={saveDados}
                  onChange={(e) => setSalvarDados(e.target.checked)}
                  className="accent-purple-600"
                />
                Lembrar dados
              </label>

              <a className="text-neutral-500 hover:text-purple-500 transition cursor-pointer">
                Esqueceu a senha?
              </a>
            </div>

          </div>

          {/* Button */}
          <button
            onClick={handleClick}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 py-3 rounded-md font-medium text-white flex items-center justify-center gap-2 transition"
          >
            {!loading ? (
              <>
                Entrar
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </>
            ) : (
              <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-md" />
            )}
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-600 mt-6">
          © 2025 NovusTech
        </p>

      </div>

      <ToastContainer limit={1} closeOnClick theme="colored" />
    </div>
  )
}