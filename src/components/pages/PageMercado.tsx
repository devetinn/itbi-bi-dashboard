import { motion } from 'framer-motion'
import { KPICard } from '../ui/KPICard'
import { ChartCard } from '../ui/ChartCard'
import { TipoUsoDonut } from '../charts/TipoUsoDonut'
import { PadraoConstrutivo } from '../charts/PadraoConstrutivo'
import { ScatterIdadeValor } from '../charts/ScatterIdadeValor'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

interface Props {
  kpis: {
    pctResidencial: number
    pctHabitacional: number
    padraoMaisComum: string
    ticketLuxo: string
    ticketEcon: string
  }
  tipoUso: { tipo: string; total: number; pct: number }[]
  padraoConstrutivo: { padrao: string; total: number }[]
  scatterData: { x: number; y: number; bairro: string }[]
}

export function PageMercado({ kpis, tipoUso, padraoConstrutivo, scatterData }: Props) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Residencial" value={`${kpis.pctResidencial.toFixed(1)}%`} icon="🏠" sublabel="Do total de transações" />
        <KPICard label="Prog. Habitacional" value={`${kpis.pctHabitacional.toFixed(1)}%`} icon="🏗️" sublabel="Do total de transações" />
        <KPICard label="Padrão mais comum" value={kpis.padraoMaisComum} icon="📐" sublabel="Construtivo" />
        <KPICard label="Luxo vs Econômico" value={kpis.ticketLuxo} sublabel={`Econ: ${kpis.ticketEcon}`} highlighted />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">
          <ChartCard title="Tipo de Uso" subtitle="Distribuição">
            <TipoUsoDonut data={tipoUso} />
          </ChartCard>
        </div>
        <div className="md:col-span-8">
          <ChartCard title="Padrão Construtivo" subtitle="Por categoria">
            <PadraoConstrutivo data={padraoConstrutivo} />
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Relação entre Idade do Imóvel e Valor por m²" fullWidth>
        <ScatterIdadeValor data={scatterData} />
      </ChartCard>
    </motion.div>
  )
}
