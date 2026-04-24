import { AnimatePresence } from 'framer-motion'
import { FilterChip } from '../ui/FilterChip'
import { useFilterContext } from '../../context/FilterContext'

export function ActiveFilterChips() {
  const { filters, toggleBairro, toggleFaixa, toggleTipo, clearFilters, activeCount, hasActiveFilters } = useFilterContext()

  const allChips = [
    ...filters.bairros.map((b) => ({ label: b, onRemove: () => toggleBairro(b) })),
    ...filters.faixasValor.map((f) => ({ label: f, onRemove: () => toggleFaixa(f) })),
    ...filters.tiposUso.map((t) => ({ label: t, onRemove: () => toggleTipo(t) })),
  ]

  const visible = allChips.slice(0, 2)
  const extra = activeCount - visible.length

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <AnimatePresence>
        {visible.map((chip) => (
          <FilterChip key={chip.label} label={chip.label} onRemove={chip.onRemove} />
        ))}
      </AnimatePresence>
      {extra > 0 && (
        <span className="text-xs text-[#8A8A8A] font-medium">+{extra} mais</span>
      )}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-[#4A7C6F] underline hover:text-[#2D6A5F] transition-colors"
        >
          Limpar
        </button>
      )}
    </div>
  )
}
