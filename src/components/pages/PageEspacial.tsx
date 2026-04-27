import { motion } from 'framer-motion'
import { KPICard } from '../ui/KPICard'
import { ChartCard } from '../ui/ChartCard'
import { RankingBairros } from '../charts/RankingBairros'
import { ValorM2Bairros } from '../charts/ValorM2Bairros'
import { ParetoChart } from '../charts/ParetoChart'
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
  paretoData: { bairro: string; total: number; pctAcum: number }[]
}

export function PageEspacial({ kpis, rankingBairros, valorM2Bairros, paretoData }: Props) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Bairros com Transações" value={kpis.totalBairros} sublabel="Abrangência geográfica registrada" variant="petrol" />
        <KPICard label="Maior Volume Transacional" value={kpis.topBairroTransacoes.bairro || '-'} sublabel={`${kpis.topBairroTransacoes.total.toLocaleString('pt-BR')} transações registradas`} variant="orange" highlighted />
        <KPICard label="Maior Valor Unitário (R$/m²)" value={kpis.topBairroM2.bairro || '-'} sublabel={formatBRL(kpis.topBairroM2.valorMedio)} variant="teal" />
        <KPICard label="Concentração 80/20" value={`${kpis.count80Bairros} bairros`} sublabel="respondem por 80% das transações" variant="cyan" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Volume de Transações por Bairro" subtitle="15 bairros mais ativos — clique para filtrar" accentColor="#325565">
          <RankingBairros data={rankingBairros} />
        </ChartCard>
        <ChartCard title="Valor Médio Declarado por m²" subtitle="20 bairros com maior valorização unitária" accentColor="#009889">
          <ValorM2Bairros data={valorM2Bairros} />
        </ChartCard>
      </div>

      {/* Análise de Pareto — chart de largura total */}
      <ChartCard
        title="Análise de Pareto — Concentração por Bairro"
        subtitle={`Quantos bairros concentram 80% das transações? (top 40 de ${paretoData.length} bairros)`}
        accentColor="#F15A22"
      >
        <ParetoChart data={paretoData} />
      </ChartCard>
    </motion.div>
  )
}
