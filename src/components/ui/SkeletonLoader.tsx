import type React from 'react'
import { motion, type Variants } from 'framer-motion'

function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className ?? ''}`} style={style} />
}

function KPIBone() {
  return (
    <div
      className="rounded-[14px] p-5 space-y-3 border"
      style={{ background: '#FFFFFF', borderColor: '#E7E4DC' }}
    >
      <div className="flex justify-between items-center">
        <Bone className="h-2.5 w-20 rounded-full" />
        <Bone className="h-5 w-5 rounded-full" />
      </div>
      <Bone className="h-9 w-28 rounded-xl" />
      <Bone className="h-2 w-16 rounded-full" />
      <Bone className="h-10 w-full rounded-xl" />
    </div>
  )
}

function ChartBone({ height = 220 }: { height?: number }) {
  return (
    <div
      className="rounded-[14px] p-5 space-y-3 border"
      style={{ background: '#FFFFFF', borderColor: '#E7E4DC' }}
    >
      <div className="flex items-center justify-between">
        <Bone className="h-3.5 w-36 rounded-full" />
        <Bone className="h-2 w-16 rounded-full" />
      </div>
      <Bone className="h-px w-full rounded-full" />
      <Bone style={{ height }} className="w-full rounded-xl" />
    </div>
  )
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

export function SkeletonLoader() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <motion.div key={i} variants={item}><KPIBone /></motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={item}><ChartBone height={220} /></motion.div>
        <motion.div variants={item}><ChartBone height={220} /></motion.div>
      </div>
      <motion.div variants={item}><ChartBone height={180} /></motion.div>
      <motion.p
        variants={item}
        className="text-center text-xs tracking-wider"
        style={{ fontFamily: 'var(--f-mono)', color: '#9A9A95' }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const }}
      >
        Processando 94.970 registros...
      </motion.p>
    </motion.div>
  )
}
