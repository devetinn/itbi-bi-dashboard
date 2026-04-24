import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { cardAnim } from './KPICard'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  colSpan?: 1 | 2
  fullWidth?: boolean
}

export function ChartCard({ title, subtitle, children, colSpan, fullWidth }: ChartCardProps) {
  return (
    <motion.div
      variants={cardAnim}
      className={`bg-white border border-[#E8E6DF] rounded-2xl p-5 hover:border-[#4A7C6F] transition-all duration-200 ${
        colSpan === 2 || fullWidth ? 'col-span-2' : ''
      }`}
    >
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-sm font-semibold text-[#1A1A1A]">{title}</span>
        {subtitle && <span className="text-xs text-[#8A8A8A]">{subtitle}</span>}
      </div>
      <div className="h-px bg-[#E8E6DF] mb-4" />
      {children}
    </motion.div>
  )
}
