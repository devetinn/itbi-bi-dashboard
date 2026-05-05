import { motion, type Variants } from 'framer-motion'
import { KPICard } from '../ui/KPICard'
import { ChartCard } from '../ui/ChartCard'
import { TipoUsoDonut } from '../charts/TipoUsoDonut'
import { PadraoConstrutivo } from '../charts/PadraoConstrutivo'
import { ScatterIdadeValor } from '../charts/ScatterIdadeValor'
import { ZoneamentoChart } from '../charts/ZoneamentoChart'
import { CorrelacaoTransacoes, type CorrelacaoPoint } from '../charts/CorrelacaoTransacoes'
import { DataQualityPanel } from '../DataQualityPanel'

const stagger: Variants = {
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
  zoneamentoData: { zona: string; total: number; pct: number }[]
  correlacaoBairros: CorrelacaoPoint[]
  validationParams: {
    totalRegistros: number
    bairrosUnicos: number
    registrosComValor: number
    somaVlBaseCalculo: number
    mediaVlBaseCalculo: number
  }
}

export function PageMercado({ kpis, tipoUso, padraoConstrutivo, scatterData, zoneamentoData, correlacaoBairros, validationParams }: Props) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Residencial" value={`${kpis.pctResidencial.toFixed(1)}%`} sublabel="Do total de transações" variant="teal" />
        <KPICard label="Prog. Habitacional" value={`${kpis.pctHabitacional.toFixed(1)}%`} sublabel="Do total de transações" variant="cyan" />
        <KPICard label="Padrão mais comum" value={kpis.padraoMaisComum} sublabel="Construtivo" variant="petrol" />
        <KPICard label="Luxo vs Econômico" value={kpis.ticketLuxo} sublabel={`Econ: ${kpis.ticketEcon}`} highlighted variant="orange" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">
          <ChartCard title="Tipo de Uso" subtitle="Distribuição" accentColor="#F15A22">
            <TipoUsoDonut data={tipoUso} />
          </ChartCard>
        </div>
        <div className="md:col-span-8">
          <ChartCard title="Padrão Construtivo" subtitle="Por categoria" accentColor="#325565">
            <PadraoConstrutivo data={padraoConstrutivo} />
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7">
          <ChartCard
            title="Correlação: Idade × Valor/m²"
            subtitle="Pearson r — linha de tendência linear"
            accentColor="#009889"
          >
            <ScatterIdadeValor data={scatterData} />
          </ChartCard>
        </div>
        <div className="md:col-span-5">
          <ChartCard title="Zoneamento" subtitle="transações por zona urbana" accentColor="#00A0DC">
            <ZoneamentoChart data={zoneamentoData} />
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <ChartCard
            title="Correlação: Volume × Valor Médio por Bairro"
            subtitle="Pearson r — bairros com ≥ 10 transações — linha de tendência linear"
            accentColor="#325565"
          >
            <CorrelacaoTransacoes data={correlacaoBairros} />
          </ChartCard>
        </div>
        <div className="md:col-span-4">
          <DataQualityPanel {...validationParams} />
        </div>
      </div>
    </motion.div>
  )
}
