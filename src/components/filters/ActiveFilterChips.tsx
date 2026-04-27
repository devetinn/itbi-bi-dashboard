import { AnimatePresence } from 'framer-motion'
import { FilterChip } from '../ui/FilterChip'
import { useFilterContext } from '../../context/FilterContext'
import { FAIXA_LABELS } from '../../utils/filterHelpers'

export function ActiveFilterChips() {
  const {
    filters, toggleBairro, toggleFaixa, toggleTipo,
    togglePadrao, toggleAno, activeCount, hasActiveFilters,
  } = useFilterContext()

  const allChips = [
    ...filters.bairros.map((b) => ({ label: b, onRemove: () => toggleBairro(b) })),
    ...filters.faixasValor.map((f) => ({ label: FAIXA_LABELS[f] ?? f, onRemove: () => toggleFaixa(f) })),
    ...filters.tiposUso.map((t) => ({ label: t.charAt(0) + t.slice(1).toLowerCase(), onRemove: () => toggleTipo(t) })),
    ...filters.padraosConstrucao.map((p) => ({ label: p, onRemove: () => togglePadrao(p) })),
    ...filters.anos.map((a) => ({ label: String(a), onRemove: () => toggleAno(a) })),
  ]

  const visible = allChips.slice(0, 3)
  const extra = activeCount - visible.length

  if (!hasActiveFilters) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <AnimatePresence>
        {visible.map((chip) => (
          <FilterChip key={chip.label} label={chip.label} onRemove={chip.onRemove} />
        ))}
      </AnimatePresence>
      {extra > 0 && (
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: '#E8EEF1', color: '#325565', fontFamily: 'var(--f-display)' }}
        >
          +{extra}
        </span>
      )}
    </div>
  )
}
