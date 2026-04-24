import { motion, type Variants } from 'framer-motion'
import { useCountAnimation } from '../../hooks/useCountAnimation'
import { Sparkline } from './Sparkline'

interface KPICardProps {
  label: string
  value: string | number
  sublabel?: string
  sublabelPositive?: boolean
  sparklineData?: number[]
  highlighted?: boolean
  icon?: string
}

export const cardAnim: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

function AnimatedNumber({ value }: { value: number }) {
  const animated = useCountAnimation(value)
  return <>{animated.toLocaleString('pt-BR')}</>
}

export function KPICard({ label, value, sublabel, sublabelPositive, sparklineData, highlighted, icon }: KPICardProps) {
  const isNumeric = typeof value === 'number'

  return (
    <motion.div
      variants={cardAnim}
      className={`rounded-2xl p-5 transition-all duration-200 ${
        highlighted
          ? 'bg-[#4A7C6F] border-none'
          : 'bg-white border border-[#E8E6DF] hover:border-[#4A7C6F]'
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <span className={`text-xs font-medium uppercase tracking-wide ${highlighted ? 'text-white/70' : 'text-[#8A8A8A]'}`}>
          {label}
        </span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>

      <div className={`text-3xl font-bold tracking-tight ${highlighted ? 'text-white' : 'text-[#1A1A1A]'}`}>
        {isNumeric ? <AnimatedNumber value={value as number} /> : value}
      </div>

      {sublabel && (
        <div className={`text-xs mt-1 ${
          highlighted ? 'text-white/70' :
          sublabelPositive === true ? 'text-green-600' :
          sublabelPositive === false ? 'text-red-500' :
          'text-[#8A8A8A]'
        }`}>
          {sublabel}
        </div>
      )}

      {sparklineData && sparklineData.length > 0 && (
        <Sparkline data={sparklineData} highlighted={highlighted} />
      )}
    </motion.div>
  )
}
