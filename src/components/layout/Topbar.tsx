import { ActiveFilterChips } from '../filters/ActiveFilterChips'
import { useFilterContext } from '../../context/FilterContext'
import { formatCount } from '../../utils/formatters'

const PAGE_TITLES: Record<string, string> = {
  temporal: 'Análise Temporal',
  espacial: 'Análise Espacial',
  mercado: 'Análise de Mercado',
  explorer: 'Explorer',
}

interface TopbarProps {
  activePage: string
  totalRegistros: number
  onMenuToggle: () => void
}

export function Topbar({ activePage, totalRegistros, onMenuToggle }: TopbarProps) {
  const { filteredData, hasActiveFilters } = useFilterContext()
  const count = hasActiveFilters ? filteredData.length : totalRegistros

  return (
    <header className="sticky top-0 z-10 h-14 bg-[#F0EFEA] border-b border-[#E8E6DF] flex items-center px-6 gap-4">
      <button
        className="md:hidden p-1 text-[#4A4A4A] hover:text-[#1A1A1A]"
        onClick={onMenuToggle}
        aria-label="Menu"
      >
        ☰
      </button>

      <span className="text-base font-semibold text-[#1A1A1A] whitespace-nowrap">
        {PAGE_TITLES[activePage] ?? activePage}
      </span>

      <div className="flex-1 flex items-center gap-2 overflow-hidden">
        <ActiveFilterChips />
      </div>

      <div className="hidden md:block h-5 w-px bg-[#E8E6DF]" />
      <span className="text-xs text-[#8A8A8A] whitespace-nowrap">
        {formatCount(count)} registros
      </span>
    </header>
  )
}
