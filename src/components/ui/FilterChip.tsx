import { motion } from 'framer-motion'

interface FilterChipProps {
  label: string
  onRemove: () => void
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#4A7C6F] bg-[#E8F0EE] border border-[#4A7C6F] rounded-full"
    >
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 text-[#4A7C6F] hover:text-[#2D6A5F] leading-none"
        aria-label={`Remover filtro ${label}`}
      >
        ✕
      </button>
    </motion.span>
  )
}
