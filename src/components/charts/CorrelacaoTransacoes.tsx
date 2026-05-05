import {
  ComposedChart, Scatter, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatBRL } from '../../utils/formatters'
import { pearsonCorrelation, linearRegression, interpretCorrelation } from '../../utils/statistics'

export interface CorrelacaoPoint {
  bairro: string
  totalTransacoes: number
  valorMedio: number
}

interface Props {
  data: CorrelacaoPoint[]
}

function CustomTooltip({ active, payload }: {
  active?: boolean
  payload?: { payload: CorrelacaoPoint }[]
}) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-[#E8E6DF] rounded-xl p-3 text-xs shadow-sm">
      <div className="font-semibold text-[#1A1A1A]">{d.bairro}</div>
      <div className="text-[#4A4A4A]">Transações: {d.totalTransacoes.toLocaleString('pt-BR')}</div>
      <div className="text-[#4A4A4A]">Valor médio: {formatBRL(d.valorMedio)}</div>
    </div>
  )
}

export function CorrelacaoTransacoes({ data }: Props) {
  const xs = data.map((d) => d.totalTransacoes)
  const ys = data.map((d) => d.valorMedio)
  const r = pearsonCorrelation(xs, ys)
  const { slope, intercept } = linearRegression(xs, ys)
  const interp = interpretCorrelation(r)

  const xMin = Math.min(...xs)
  const xMax = Math.max(...xs)
  const trendLine = [
    { totalTransacoes: xMin, trend: slope * xMin + intercept },
    { totalTransacoes: xMax, trend: slope * xMax + intercept },
  ]

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-1">
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${interp.color}18`, color: interp.color }}
        >
          {interp.label}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
          <XAxis
            dataKey="totalTransacoes" type="number"
            tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false}
            label={{ value: 'Volume de Transações', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#8A8A8A' }}
          />
          <YAxis
            dataKey="valorMedio" type="number"
            tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false}
            tickFormatter={(v) => formatBRL(v)}
            label={{ value: 'Valor Médio (R$)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 10, fill: '#8A8A8A' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

          <Scatter data={data} name="Bairro" fill="#325565" fillOpacity={0.6} r={4} />

          <Line
            data={trendLine} dataKey="trend" name="Linha de tendência"
            stroke={interp.color} strokeWidth={2} dot={false} strokeDasharray="6 3"
            type="linear"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
