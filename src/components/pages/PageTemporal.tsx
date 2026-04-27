import { motion, type Variants } from 'framer-motion'
import { KPICard } from '../ui/KPICard'
import { ChartCard } from '../ui/ChartCard'
import { TransacoesPorMes } from '../charts/TransacoesPorMes'
import { FaixaValorBar } from '../charts/FaixaValorBar'
import { HeatmapSazonalidade } from '../charts/HeatmapSazonalidade'
import { AnoComparativo } from '../charts/AnoComparativo'

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

interface Props {
  kpis: {
    totalTransacoes: number
    valorTotalMovimentado: string
    ticketMedio: string
    mesPico: string
    sparklineTransacoes: number[]
  }
  transacoesPorMes: { mes: string; total: number; valorMedio: number }[]
  faixaValor: { faixa: string; label: string; total: number; pct: string }[]
  heatmapData: { ano: number; meses: { mes: number; label: string; total: number }[] }[]
  anoStats: { ano: number; qtd: number; vgv: number }[]
}

export function PageTemporal({ kpis, transacoesPorMes, faixaValor, heatmapData, anoStats }: Props) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Total de Transações"
          value={kpis.totalTransacoes}
          sparklineData={kpis.sparklineTransacoes}
          sublabel="registros no dataset"
          variant="petrol"
        />
        <KPICard
          label="Volume Movimentado"
          value={kpis.valorTotalMovimentado}
          sparklineData={kpis.sparklineTransacoes}
          sublabel="base de cálculo"
          variant="teal"
        />
        <KPICard
          label="Ticket Médio"
          value={kpis.ticketMedio}
          sublabel="por transação"
          variant="cyan"
        />
        <KPICard
          label="Mês de Pico"
          value={kpis.mesPico}
          sublabel="maior volume registrado"
          highlighted
          variant="orange"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <ChartCard title="Transações por Mês" subtitle="série histórica — hover para detalhes" accentColor="#F15A22">
            <TransacoesPorMes data={transacoesPorMes} />
          </ChartCard>
        </div>
        <div className="md:col-span-4">
          <ChartCard title="Faixa de Valor" subtitle="distribuição" accentColor="#325565">
            <FaixaValorBar data={faixaValor} />
          </ChartCard>
        </div>
      </div>

      {/* Heatmap + Comparativo Anual */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <ChartCard title="Sazonalidade Histórica" subtitle="transações por mês × ano — hover para detalhes" accentColor="#009889">
            <HeatmapSazonalidade data={heatmapData} />
          </ChartCard>
        </div>
        <div className="md:col-span-4">
          <ChartCard title="Comparativo Anual" subtitle="clique no ano para filtrar" accentColor="#00A0DC">
            <AnoComparativo data={anoStats} />
          </ChartCard>
        </div>
      </div>
    </motion.div>
  )
}
