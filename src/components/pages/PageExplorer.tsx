import { motion } from 'framer-motion'
import { Treemap } from '../charts/Treemap'

const pageAnim = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.2 } },
}

interface Props {
  treemapData: { name: string; size: number; valorMedio: number }[]
}

export function PageExplorer({ treemapData }: Props) {
  return (
    <motion.div variants={pageAnim} initial="hidden" animate="show" className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#1A1A1A]">Mapa de Calor por Bairro</h2>
        <p className="text-xs text-[#8A8A8A] mt-0.5">
          Tamanho = volume de transações · Cor = valor médio/m²
        </p>
      </div>
      <div className="flex-1" style={{ height: 'calc(100vh - 200px)' }}>
        <Treemap data={treemapData} />
      </div>
    </motion.div>
  )
}
