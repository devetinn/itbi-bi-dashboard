import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFilterContext } from '../../context/FilterContext'
import { FAIXA_LABELS, FAIXA_ORDER } from '../../utils/filterHelpers'

interface FilterPanelProps {
  open: boolean
  onClose: () => void
}

const TIPOS = ['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'OUTROS', 'PROGRAMA HABITACIONAL']
const ANOS_AVAILABLE = [2022, 2023, 2024, 2025]

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      className="text-[10px] font-semibold uppercase tracking-[.1em] mb-2 mt-4"
      style={{ fontFamily: 'var(--f-display)', color: '#6E6E6B' }}
    >
      {title}
    </div>
  )
}

function ToggleChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150 cursor-pointer"
      style={{
        fontFamily: 'var(--f-display)',
        background: active ? '#F15A22' : 'transparent',
        color: active ? '#fff' : '#414042',
        borderColor: active ? '#F15A22' : '#E7E4DC',
      }}
    >
      {label}
    </motion.button>
  )
}

export function FilterPanel({ open, onClose }: FilterPanelProps) {
  const {
    filters, toggleFaixa, toggleTipo, togglePadrao, toggleBairro, toggleAno,
    clearFilters, activeCount, allData,
  } = useFilterContext()

  const [bairroSearch, setBairroSearch] = useState('')

  // Compute available bairros + padroes from allData
  const allBairros = useMemo(() => {
    const set = new Set(allData.map((r) => r.bairro))
    return [...set].sort()
  }, [allData])

  const allPadroes = useMemo(() => {
    const set = new Set(allData.map((r) => r.padrao_construcao).filter(Boolean) as string[])
    return [...set].sort()
  }, [allData])

  const filteredBairros = useMemo(() =>
    allBairros.filter((b) => b.toLowerCase().includes(bairroSearch.toLowerCase())),
    [allBairros, bairroSearch]
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.3)' }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col shadow-2xl"
            style={{
              width: 280,
              background: '#FFFFFF',
              borderLeft: '1px solid #E7E4DC',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: '#E7E4DC' }}
            >
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 3h12M3 7h8M5 11h4" stroke="#F15A22" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span
                  className="text-sm font-bold"
                  style={{ fontFamily: 'var(--f-display)', color: '#1A1A1A' }}
                >
                  Filtros
                </span>
                {activeCount > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: '#F15A22' }}
                  >
                    {activeCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[11px] font-semibold transition-colors"
                    style={{ fontFamily: 'var(--f-display)', color: '#C04617' }}
                  >
                    Limpar
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: '#6E6E6B' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F5F3EE')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              {/* Faixa de Valor */}
              <SectionHeader title="Faixa de Valor" />
              <div className="flex flex-wrap gap-1.5">
                {FAIXA_ORDER.filter((f) => f !== 'DESCONHECIDO').map((faixa) => (
                  <ToggleChip
                    key={faixa}
                    label={FAIXA_LABELS[faixa]}
                    active={filters.faixasValor.includes(faixa)}
                    onClick={() => toggleFaixa(faixa)}
                  />
                ))}
              </div>

              {/* Tipo de Uso */}
              <SectionHeader title="Tipo de Uso" />
              <div className="flex flex-wrap gap-1.5">
                {TIPOS.map((tipo) => (
                  <ToggleChip
                    key={tipo}
                    label={tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                    active={filters.tiposUso.includes(tipo)}
                    onClick={() => toggleTipo(tipo)}
                  />
                ))}
              </div>

              {/* Ano */}
              <SectionHeader title="Ano" />
              <div className="flex flex-wrap gap-1.5">
                {ANOS_AVAILABLE.map((ano) => (
                  <ToggleChip
                    key={ano}
                    label={String(ano)}
                    active={filters.anos.includes(ano)}
                    onClick={() => toggleAno(ano)}
                  />
                ))}
              </div>

              {/* Padrão Construtivo */}
              {allPadroes.length > 0 && (
                <>
                  <SectionHeader title="Padrão Construtivo" />
                  <div className="flex flex-wrap gap-1.5">
                    {allPadroes.slice(0, 10).map((p) => (
                      <ToggleChip
                        key={p}
                        label={p.charAt(0) + p.slice(1).toLowerCase()}
                        active={filters.padraosConstrucao.includes(p)}
                        onClick={() => togglePadrao(p)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Bairro */}
              <SectionHeader title="Bairro" />
              <input
                type="text"
                placeholder="Buscar bairro..."
                value={bairroSearch}
                onChange={(e) => setBairroSearch(e.target.value)}
                className="w-full text-[12px] px-3 py-1.5 rounded-lg border mb-2 outline-none"
                style={{
                  fontFamily: 'var(--f-body)',
                  borderColor: '#E7E4DC',
                  color: '#1A1A1A',
                  background: '#FAFAF7',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#F15A22')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E7E4DC')}
              />
              <div className="space-y-0.5 max-h-48 overflow-y-auto">
                {filteredBairros.map((bairro) => {
                  const active = filters.bairros.includes(bairro)
                  return (
                    <button
                      key={bairro}
                      onClick={() => toggleBairro(bairro)}
                      className="w-full text-left flex items-center gap-2 px-2 py-1 rounded-md text-[12px] transition-colors"
                      style={{
                        fontFamily: 'var(--f-body)',
                        background: active ? '#FEEFE7' : 'transparent',
                        color: active ? '#C04617' : '#414042',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F5F3EE' }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center"
                        style={{
                          background: active ? '#F15A22' : 'transparent',
                          borderColor: active ? '#F15A22' : '#D8D4C9',
                        }}
                      >
                        {active && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      {bairro}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
