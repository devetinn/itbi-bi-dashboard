import { motion, AnimatePresence } from 'framer-motion'
import { ActiveFilterChips } from '../filters/ActiveFilterChips'
import { useFilterContext } from '../../context/FilterContext'
import { formatCount } from '../../utils/formatters'
import { AboutModal } from '../AboutModal'

const PAGE_TITLES: Record<string, string> = {
  temporal: 'Análise Temporal',
  espacial: 'Análise Espacial',
  mercado:  'Análise de Mercado',
  explorer: 'Explorer',
}

interface TopbarProps {
  activePage: string
  totalRegistros: number
  onMenuToggle: () => void
  onFilterToggle: () => void
  filterOpen: boolean
}

export function Topbar({ activePage, totalRegistros, onMenuToggle, onFilterToggle, filterOpen }: TopbarProps) {
  const { filteredData, hasActiveFilters, activeCount } = useFilterContext()
  const count = hasActiveFilters ? filteredData.length : totalRegistros

  return (
    <header
      className="sticky top-0 z-10 h-14 border-b flex items-center px-5 gap-4"
      style={{
        borderColor: '#E7E4DC',
        background: 'rgba(250,250,247,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Mobile menu toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="md:hidden p-1.5 rounded-lg transition-colors"
        style={{ color: '#414042' }}
        onClick={onMenuToggle}
        aria-label="Menu"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <rect width="18" height="2" rx="1" fill="currentColor"/>
          <rect y="6" width="12" height="2" rx="1" fill="currentColor"/>
          <rect y="12" width="16" height="2" rx="1" fill="currentColor"/>
        </svg>
      </motion.button>

      {/* Page title */}
      <AnimatePresence mode="wait">
        <motion.span
          key={activePage}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18, ease: 'easeOut' as const }}
          className="text-sm font-bold whitespace-nowrap"
          style={{ fontFamily: 'var(--f-display)', color: '#1A1A1A', letterSpacing: '-0.01em' }}
        >
          {PAGE_TITLES[activePage] ?? activePage}
        </motion.span>
      </AnimatePresence>

      {/* Filter chips */}
      <div className="flex-1 flex items-center gap-2 overflow-hidden min-w-0">
        <ActiveFilterChips />
      </div>

      {/* Divider */}
      <div className="hidden md:block h-4 w-px" style={{ background: '#E7E4DC' }} />

      {/* About */}
      <AboutModal />

      {/* Record count */}
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.18 }}
          className="text-[11px] whitespace-nowrap font-semibold tabular-nums"
          style={{ fontFamily: 'var(--f-mono)', color: '#6E6E6B' }}
        >
          {formatCount(count)} registros
        </motion.span>
      </AnimatePresence>

      {/* Filter button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onFilterToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-150 relative"
        style={{
          fontFamily: 'var(--f-display)',
          background: filterOpen ? '#F15A22' : activeCount > 0 ? '#FEEFE7' : 'transparent',
          color: filterOpen ? '#fff' : activeCount > 0 ? '#C04617' : '#6E6E6B',
          borderColor: filterOpen ? '#F15A22' : activeCount > 0 ? '#F15A22' : '#E7E4DC',
        }}
        aria-label="Filtros"
      >
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 1.5h10M3 5h6M5 8.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        Filtros
        {activeCount > 0 && !filterOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
            style={{ background: '#F15A22' }}
          >
            {activeCount}
          </motion.span>
        )}
      </motion.button>
    </header>
  )
}
