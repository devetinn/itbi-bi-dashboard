import { motion } from 'framer-motion'
import { KPICard } from '../ui/KPICard'
import { ChartCard } from '../ui/ChartCard'
import { RankingBairros } from '../charts/RankingBairros'
import { ValorM2Bairros } from '../charts/ValorM2Bairros'
import { formatBRL } from '../../utils/formatters'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

interface Props {
  kpis: {
    totalBairros: number
    topBairroTransacoes: { bairro: string; total: number }
    topBairroM2: { bairro: string; valorMedio: number }
    count80Bairros: number
  }
  rankingBairros: { bairro: string; total: number; valorMedio: number }[]
  valorM2Bairros: { bairro: string; valorMedio: number }[]
}

export function PageEspacial({ kpis, rankingBairros, valorM2Bairros }: Props) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Bairros Registrados" value={kpis.totalBairros} icon="🏘️" sublabel="Bairros com transações" />
        <KPICard label="Top Bairro — Volume" value={kpis.topBairroTransacoes.bairro || '-'} icon="🏆" sublabel={`${kpis.topBairroTransacoes.total.toLocaleString('pt-BR')} transações`} />
        <KPICard label="Top Bairro — Valor/m²" value={kpis.topBairroM2.bairro || '-'} icon="💎" sublabel={formatBRL(kpis.topBairroM2.valorMedio)} />
        <KPICard label="Concentração" value={`${kpis.count80Bairros} bairros`} sublabel="= 80% do valor total" highlighted />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Ranking de Bairros" subtitle="Top 15 por transações">
          <RankingBairros data={rankingBairros} />
        </ChartCard>
        <ChartCard title="Valor por m²" subtitle="Top 20 por valor médio">
          <ValorM2Bairros data={valorM2Bairros} />
        </ChartCard>
      </div>
    </motion.div>
  )
}
