import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { cardAnim } from './KPICard'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  colSpan?: 1 | 2
  fullWidth?: boolean
  accentColor?: string
}

export function ChartCard({
  title, subtitle, children, colSpan, fullWidth, accentColor = '#F15A22',
}: ChartCardProps) {
  return (
    <motion.div
      variants={cardAnim}
      whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(20,20,20,.06), 0 2px 4px rgba(20,20,20,.04)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={`relative bg-white border border-[#E7E4DC] rounded-[14px] overflow-hidden transition-colors duration-200 hover:border-[#D8D4C9] ${
        colSpan === 2 || fullWidth ? 'col-span-2' : ''
      }`}
    >
      {/* Top accent line — appears on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: accentColor, opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3
              className="font-bold text-[16px] tracking-[-0.005em] text-[#1A1A1A] leading-tight"
              style={{ fontFamily: 'var(--f-display)' }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-[12.5px] text-[#6E6E6B] mt-0.5" style={{ fontFamily: 'var(--f-body)' }}>
                {subtitle}
              </p>
            )}
          </div>
          <div
            className="w-2 h-2 rounded-full mt-1 opacity-50"
            style={{ background: accentColor }}
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E7E4DC] mb-4" />

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.45,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number],
          }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}
