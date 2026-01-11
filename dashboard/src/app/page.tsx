"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '../hooks/useLogin'
import { toast, ToastContainer } from 'react-toastify'
import Image from 'next/image'

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveDados, setSalvarDados] = useState(false);

  async function handleClick() {
      setLoading(true);
      const test = await login(email, password, saveDados);

      if (test) {
        router.push('/dashboard');
      }
      setLoading(false);
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('senha');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setSalvarDados(true);
    }
  }, []);

  return (
    <div className='flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:p-8'>
      {/* Card Container */}
      <div className='aparecer w-full max-w-md sm:max-w-lg md:max-w-xl'>
        <div className='relative overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-800/50 bg-neutral-900/80 backdrop-blur-xl shadow-2xl'>
          {/* Decorative gradient orbs */}
          <div className='absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none' />
          <div className='absolute -bottom-24 -left-24 w-48 h-48 bg-secundary/20 rounded-full blur-3xl pointer-events-none' />

          {/* Content */}
          <div className='relative z-10 flex flex-col items-center gap-6 sm:gap-8 p-6 sm:p-8 md:p-10 lg:p-12'>
            {/* Logo/Icon */}
            <Image src={'logoNovusTech.png'} alt="NovusTech Logo" className='rounded-2xl' width={100} height={100} />


            {/* Header */}
            <div className='w-full text-center space-y-2'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent'>
                Bem-Vindo
              </h1>
              <p className='text-sm sm:text-base text-neutral-500'>
                Gerenciamento de Leads da NovusTech
              </p>
            </div>

            {/* Form */}
            <div className='w-full space-y-4 sm:space-y-5'>
              {/* Email Input */}
              <div className='relative group'>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors !text-xl">
                  mail
                </span>
                <input
                  className="input !pl-11 !py-3 sm:!py-4 text-sm sm:text-base"
                  placeholder="Email"
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className='relative group'>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors !text-xl">
                  lock
                </span>
                <input
                  className="input !pl-11 !pr-12 !py-3 sm:!py-4 text-sm sm:text-base"
                  placeholder="Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className='absolute right-3 top-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer text-neutral-500 hover:text-neutral-300 transition-colors'
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  type="button"
                >
                  <span className="material-symbols-outlined !text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Checkbox */}
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <input
                    id='checkbox'
                    className='peer sr-only'
                    name='checkbox'
                    checked={saveDados}
                    type='checkbox'
                    onChange={(e) => setSalvarDados(e.target.checked)}
                  />
                  <label
                    htmlFor='checkbox'
                    className='flex items-center justify-center w-5 h-5 rounded border-2 border-neutral-600 cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary'
                  >
                    {saveDados && (
                      <span className="material-symbols-outlined text-white !text-sm">
                        check
                      </span>
                    )}
                  </label>
                </div>
                <label htmlFor='checkbox' className='cursor-pointer text-sm sm:text-base text-neutral-400 hover:text-neutral-300 transition-colors select-none'>
                  Lembrar meus dados
                </label>
              </div>
            </div>

            {/* Login Button */}
            <button
              className='button group w-full !text-lg sm:!text-xl !py-3 sm:!py-4 mt-2'
              onClick={handleClick}
              disabled={loading}
            >
              {!loading ? (
                <>
                  <span>Acessar</span>
                  <span className="material-symbols-outlined !text-xl sm:!text-2xl group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              ) : (
                <div className="animate-spin h-6 w-6 sm:h-7 sm:w-7 border-3 border-white/30 border-t-white rounded-full"></div>
              )}
            </button>

            {/* Forgot Password Link */}
            <div className='group cursor-pointer'>
              <a className='text-sm sm:text-base text-neutral-500 hover:text-neutral-300 transition-colors'>
                Esqueceu a senha? <span className='text-primary font-medium'>Clique aqui</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className='text-center text-xs sm:text-sm text-neutral-600 mt-6 sm:mt-8'>
          © 2025 NovusTech. Todos os direitos reservados.
        </p>
      </div>

      <ToastContainer
        limit={1}
        closeOnClick={true}
        theme='colored'
      />
    </div>
  )
}
