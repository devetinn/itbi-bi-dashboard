import { motion } from 'framer-motion'
import { KPICard } from '../ui/KPICard'
import { ChartCard } from '../ui/ChartCard'
import { TransacoesPorMes } from '../charts/TransacoesPorMes'
import { FaixaValorBar } from '../charts/FaixaValorBar'
import { Sazonalidade } from '../charts/Sazonalidade'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
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
  faixaValor: { faixa: string; total: number; pct: string }[]
  sazonalidadeGrid: { mes: number; label: string; total: number }[]
}

export function PageTemporal({ kpis, transacoesPorMes, faixaValor, sazonalidadeGrid }: Props) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total de Transações" value={kpis.totalTransacoes} icon="📋" sparklineData={kpis.sparklineTransacoes} sublabel="Total acumulado" />
        <KPICard label="Volume Movimentado" value={kpis.valorTotalMovimentado} icon="💰" sparklineData={kpis.sparklineTransacoes} sublabel="Valor total" />
        <KPICard label="Ticket Médio" value={kpis.ticketMedio} icon="📊" sublabel="Por transação" />
        <KPICard label="Mês de Pico" value={kpis.mesPico} icon="🏆" sublabel="Maior volume" highlighted />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <ChartCard title="Transações por Mês" subtitle="Série histórica">
            <TransacoesPorMes data={transacoesPorMes} />
          </ChartCard>
        </div>
        <div className="md:col-span-4">
          <ChartCard title="Faixa de Valor" subtitle="Distribuição">
            <FaixaValorBar data={faixaValor} />
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Sazonalidade" subtitle="Distribuição por mês do ano" fullWidth>
        <Sazonalidade data={sazonalidadeGrid} />
      </ChartCard>
    </motion.div>
  )
}
