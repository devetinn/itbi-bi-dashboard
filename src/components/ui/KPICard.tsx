import { motion, type Variants } from 'framer-motion'
import { useCountAnimation } from '../../hooks/useCountAnimation'
import { Sparkline } from './Sparkline'

type KPIVariant = 'orange' | 'teal' | 'petrol' | 'cyan'

interface KPICardProps {
  label: string
  value: string | number
  sublabel?: string
  sublabelPositive?: boolean
  sparklineData?: number[]
  highlighted?: boolean
  icon?: string
  variant?: KPIVariant
}

const RAIL_COLORS: Record<KPIVariant, string> = {
  orange: '#F15A22',
  teal:   '#009889',
  petrol: '#325565',
  cyan:   '#00A0DC',
}

const RAIL_BG: Record<KPIVariant, string> = {
  orange: 'rgba(241,90,34,0.06)',
  teal:   'rgba(0,152,137,0.05)',
  petrol: 'rgba(50,85,101,0.05)',
  cyan:   'rgba(0,160,220,0.05)',
}

export const cardAnim: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] },
  },
}

function AnimatedNumber({ value }: { value: number }) {
  const animated = useCountAnimation(value)
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}
    >
      {animated.toLocaleString('pt-BR')}
    </motion.span>
  )
}

export function KPICard({
  label, value, sublabel, sublabelPositive, sparklineData,
  highlighted, icon, variant = 'orange',
}: KPICardProps) {
  const isNumeric = typeof value === 'number'
  const railColor = RAIL_COLORS[variant]
  const bgTint   = highlighted ? RAIL_BG[variant] : undefined

  return (
    <motion.div
      variants={cardAnim}
      whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(20,20,20,.06), 0 2px 4px rgba(20,20,20,.04)' }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative bg-white border border-[#E7E4DC] rounded-[14px] overflow-hidden"
      style={bgTint ? { background: `linear-gradient(135deg, ${bgTint} 0%, #fff 60%)` } : undefined}
    >
      {/* 3px left accent rail */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: railColor }}
      />

      {/* Animated shimmer on highlighted */}
      {highlighted && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)`,
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' as const }}
        />
      )}

      <div className="relative pl-6 pr-5 py-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-2.5">
          <span
            className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#6E6E6B]"
            style={{ fontFamily: 'var(--f-display)' }}
          >
            {label}
          </span>
          {icon && <span className="text-base opacity-60 leading-none">{icon}</span>}
        </div>

        {/* Value */}
        <div
          className="font-extrabold tracking-[-0.02em] leading-none mb-1.5 text-[#1A1A1A]"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '2.25rem',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {isNumeric
            ? <AnimatedNumber value={value as number} />
            : (
              <motion.span
                key={String(value)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.span>
            )
          }
        </div>

        {/* Sublabel / delta */}
        {sublabel && (
          <div
            className={`text-[12.5px] font-semibold flex items-center gap-1.5 ${
              sublabelPositive === true  ? 'text-[#00746A]' :
              sublabelPositive === false ? 'text-[#C04617]' :
              'text-[#6E6E6B]'
            }`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {sublabelPositive === true  && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1L9 5H6V9H4V5H1L5 1Z" fill="currentColor"/>
              </svg>
            )}
            {sublabelPositive === false && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 9L1 5H4V1H6V5H9L5 9Z" fill="currentColor"/>
              </svg>
            )}
            {sublabel}
          </div>
        )}

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4">
            <Sparkline data={sparklineData} color={railColor} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
