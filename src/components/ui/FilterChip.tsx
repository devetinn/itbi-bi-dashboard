import { motion } from 'framer-motion'

interface FilterChipProps {
  label: string
  onRemove: () => void
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.75, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.75, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold tracking-[.04em] uppercase rounded-full"
      style={{
        fontFamily: 'var(--f-display)',
        background: '#E8EEF1',
        color: '#325565',
        border: '1px solid #DDE8EE',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#F15A22' }} aria-hidden />
      {label}
      <motion.button
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        onClick={onRemove}
        className="ml-0.5 flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center rounded-full transition-colors"
        style={{ color: '#325565' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#DDE8EE')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        aria-label={`Remover filtro ${label}`}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </motion.button>
    </motion.span>
  )
}
