'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: 'message',
      title: 'Chat em Tempo Real',
      desc: 'Gerencie todas as conversas do WhatsApp em uma plataforma centralizada e intuitiva'
    },
    {
      icon: 'smart_toy',
      title: 'IA Inteligente',
      desc: 'Respostas automáticas personalizadas com IA que aprende seu tom de atendimento'
    },
    {
      icon: 'trending_up',
      title: 'Prospecção Automática',
      desc: 'Encontre novos leads através do Google Maps e integre em segundos'
    },
    {
      icon: 'analytics',
      title: 'Análise Completa',
      desc: 'Métricas detalhadas, taxas de conversão e ROI de cada campanha'
    },
    {
      icon: 'schedule',
      title: 'Automações',
      desc: 'Agendamento de mensagens, follow-ups automáticos e fluxos personalizados'
    },
    {
      icon: 'security',
      title: 'Segurança Premium',
      desc: 'Seus dados protegidos com criptografia de ponta a ponta e backups automáticos'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 max-w-screen overflow-hidden">
      {/* Background elements */}

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        <div className="max-w-5xl w-full text-center space-y-8 z-10 overflow-hidden">
          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center rounded-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                NovusTech
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-neutral-400">
              Gestão inteligente de leads para seu WhatsApp
            </p>
          </motion.div>

          {/* Descrição */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed"
          >
            Automatize atendimentos, organize leads e aumente vendas com a solução mais moderna para WhatsApp. 
            Tudo que você precisa em uma plataforma simples e poderosa.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition duration-200 text-lg"
            >
              Começar Agora
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            <p className="text-sm text-neutral-600">
              Sem cartão de crédito. Teste gratuitamente por 14 dias.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 pt-8 mt-8 border-t border-neutral-800"
          >
            {[
              { number: '500+', label: 'Usuários Ativos' },
              { number: '100K+', label: 'Leads Gerenciados' },
              { number: '99.9%', label: 'Uptime Garantido' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-purple-400">{stat.number}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Tudo que você precisa</h2>
            <p className="text-neutral-400 text-lg">Recursos poderosos pensados para escalar seu negócio</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border border-neutral-700 bg-neutral-900/50 rounded-lg hover:border-neutral-600 transition duration-200"
              >
                <div className="w-12 h-12 bg-purple-600/20 flex items-center justify-center rounded-lg mb-4">
                  <span className="material-symbols-outlined text-purple-400">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Preview */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Planos Simples e Transparentes</h2>
            <p className="text-neutral-400 text-lg">Escolha o melhor para seu negócio</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 'R$ 99',
                features: ['Até 100 leads', 'Chat em tempo real', 'Suporte por email']
              },
              {
                name: 'Professional',
                price: 'R$ 199',
                features: ['Até 500 leads', 'IA inteligente', 'Prospecção automática', 'Relatórios completos', 'Suporte por chat'],
                highlight: true
              },
              {
                name: 'Enterprise',
                price: 'Customizado',
                features: ['Leads ilimitados', 'Tudo do Professional', 'Integrações custom', 'Suporte dedicado']
              }
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-lg border transition duration-200 ${
                  plan.highlight
                    ? 'border-purple-600 bg-purple-600/10 shadow-lg shadow-purple-600/20'
                    : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-600'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  {plan.price}
                  {plan.price !== 'Customizado' && <span className="text-sm text-neutral-400">/mês</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/login')}
                  className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
                    plan.highlight
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  Começar
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Final */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 px-6"
      >
        <div className="max-w-3xl mx-auto text-center space-y-8 p-12 border border-neutral-700 bg-neutral-900/50 rounded-lg">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold"
          >
            Pronto para escalar seu negócio?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-neutral-400 text-lg"
          >
            Comece a gerenciar seus leads e aumentar vendas hoje mesmo. Sem cartão de crédito, sem riscos.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            onClick={() => router.push('/login')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition duration-200 text-lg"
          >
            Começar Teste Gratuito
            <span className="material-symbols-outlined">arrow_forward</span>
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative border-t border-neutral-800 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-neutral-500">
          <p>© 2025 NovusTech. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
