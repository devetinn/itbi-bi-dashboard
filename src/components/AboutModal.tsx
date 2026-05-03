import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DATA_GROUND_TRUTH } from '../utils/dataValidation'

const STACK = [
  { tech: 'React + Vite', desc: 'Interface web interativa e build rápido' },
  { tech: 'TypeScript', desc: 'Tipagem e segurança do código' },
  { tech: 'Recharts', desc: 'Biblioteca de gráficos SVG' },
  { tech: 'Papaparse', desc: 'Leitura do CSV direto no browser' },
  { tech: 'Framer Motion', desc: 'Animações e transições' },
  { tech: 'Tailwind CSS', desc: 'Estilização utilitária' },
  { tech: 'Python (ETL)', desc: 'Processamento dos dados brutos da SEFIN' },
  { tech: 'Vercel', desc: 'Deploy gratuito e CDN global' },
]

export function AboutModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all"
        style={{
          fontFamily: 'var(--f-display)',
          background: 'transparent',
          color: '#6E6E6B',
          borderColor: '#E7E4DC',
          cursor: 'pointer',
        }}
        title="Sobre o projeto"
      >
        <span>ℹ️</span>
        <span className="hidden sm:inline">Sobre</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-x-4 top-[10%] md:left-1/2 md:-translate-x-1/2 md:w-[540px] md:inset-x-auto z-50 rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: '#FAFAF7', border: '1px solid #E7E4DC', maxHeight: '80vh', overflowY: 'auto' }}
            >
              {/* Header */}
              <div
                className="px-6 pt-6 pb-4 flex items-start justify-between"
                style={{ borderBottom: '1px solid #E7E4DC' }}
              >
                <div>
                  <h2
                    className="text-lg font-bold"
                    style={{ fontFamily: 'var(--f-display)', color: '#1A1A1A', letterSpacing: '-0.02em' }}
                  >
                    Dashboard ITBI Fortaleza
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#6E6E6B' }}>
                    Análise interativa de transações imobiliárias
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
                  style={{ background: '#F0EFEA', color: '#6E6E6B', border: 'none', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* O que é o ITBI */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8A8A8A', fontFamily: 'var(--f-display)' }}>
                    O que é o ITBI?
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>
                    O ITBI (Imposto sobre Transmissão de Bens Imóveis) é cobrado toda vez que um
                    imóvel muda de dono em Fortaleza. Cada transação registrada pela SEFIN revela
                    o valor do imóvel, o bairro, o tipo de uso e o padrão construtivo — dados
                    valiosos para entender o mercado imobiliário da cidade.
                  </p>
                </section>

                {/* Fonte dos dados */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8A8A8A', fontFamily: 'var(--f-display)' }}>
                    Fonte dos Dados
                  </h3>
                  <div
                    className="rounded-xl p-3 text-sm"
                    style={{ background: '#F0EFEA', border: '1px solid #E7E4DC' }}
                  >
                    <div className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>
                      Portal de Dados Abertos de Fortaleza (SEFIN)
                    </div>
                    <div className="text-xs" style={{ color: '#6E6E6B' }}>
                      dados.fortaleza.ce.gov.br · Dataset: ITBI Transações Imobiliárias
                    </div>
                    <div className="mt-2 flex gap-4 text-xs">
                      <span><strong>{DATA_GROUND_TRUTH.totalRegistros.toLocaleString('pt-BR')}</strong> registros</span>
                      <span><strong>{DATA_GROUND_TRUTH.bairrosUnicos}</strong> bairros</span>
                      <span><strong>{DATA_GROUND_TRUTH.anosCobertura}</strong></span>
                    </div>
                  </div>
                </section>

                {/* ETL */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8A8A8A', fontFamily: 'var(--f-display)' }}>
                    Como os Dados Foram Processados (ETL em Python)
                  </h3>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: '#6E6E6B' }}>
                    O CSV bruto da prefeitura possui encoding latin-1, separador ";" e números no formato brasileiro.
                    O script <code className="font-mono bg-gray-100 px-1 rounded">etl_itbi.py</code> realizou:
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { step: '1. Extract', desc: 'Leitura do CSV bruto com encoding latin-1' },
                      { step: '2. Transform', desc: 'Conversão de formatos, remoção de duplicatas, cálculo de campos derivados (idade do imóvel, valor/m², faixa de valor)' },
                      { step: '3. Load', desc: 'Salva itbi_clean.csv em UTF-8 pronto para o dashboard' },
                    ].map((s) => (
                      <div key={s.step} className="flex gap-2 text-xs">
                        <span
                          className="flex-shrink-0 font-bold"
                          style={{ color: '#4A7C6F', fontFamily: 'var(--f-mono)' }}
                        >
                          {s.step}
                        </span>
                        <span style={{ color: '#4A4A4A' }}>{s.desc}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Stack */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8A8A8A', fontFamily: 'var(--f-display)' }}>
                    Stack Tecnológica
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {STACK.map((s) => (
                      <div
                        key={s.tech}
                        className="rounded-lg px-3 py-2 text-xs"
                        style={{ background: '#F0EFEA', border: '1px solid #E7E4DC' }}
                      >
                        <div className="font-semibold" style={{ color: '#1A1A1A', fontFamily: 'var(--f-mono)' }}>
                          {s.tech}
                        </div>
                        <div style={{ color: '#6E6E6B' }}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </section>
                {/* Processo Button */}
                <section>
                  <a 
                    href="/processo.html" 
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold mt-2 transition-all hover:opacity-90" 
                    style={{ background: '#F15A22', color: '#fff', textDecoration: 'none', fontFamily: 'var(--f-display)' }}
                  >
                    Ver Processo e Arquitetura (IA + Dev)
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
