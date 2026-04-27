import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'
import { formatBRL } from '../../utils/formatters'

interface MesData {
  mes: string
  total: number
  valorMedio: number
}

interface Props {
  data: MesData[]
}

function CustomDot(props: { cx?: number; cy?: number; stroke?: string }) {
  const { cx, cy } = props
  if (cx === undefined || cy === undefined) return null
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="white"
      stroke="#4A7C6F"
      strokeWidth={2}
    />
  )
}

function makeTooltip(fullData: MesData[]) {
  return function CustomTooltip({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: { value: number; payload: MesData }[]
    label?: string
  }) {
    if (!active || !payload?.length) return null
    const curr = payload[0].payload
    const idx = fullData.findIndex((d) => d.mes === label)
    const prev = idx > 0 ? fullData[idx - 1] : null
    const pctChange =
      prev && prev.total > 0
        ? ((curr.total - prev.total) / prev.total) * 100
        : null

    return (
      <div
        className="rounded-xl p-3 text-xs shadow-lg"
        style={{ background: 'white', border: '1px solid #E8E6DF', minWidth: 180 }}
      >
        <div className="font-bold mb-2" style={{ color: '#1A1A1A', fontFamily: 'var(--f-display)' }}>
          {label}
        </div>
        <div className="flex items-center gap-1.5 mb-1" style={{ color: '#4A4A4A' }}>
          <span>{curr.total.toLocaleString('pt-BR')} transações</span>
        </div>
        {pctChange !== null && (
          <div
            className="flex items-center gap-1.5 mb-1"
            style={{ color: pctChange >= 0 ? '#2D6A5F' : '#C04617' }}
          >
            <span>{pctChange >= 0 ? '↑' : '↓'}</span>
            <span>
              {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(1)}% vs mês anterior
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5" style={{ color: '#8A8A8A' }}>
          <span>Ticket médio: {formatBRL(curr.valorMedio)}</span>
        </div>
      </div>
    )
  }
}

export function TransacoesPorMes({ data }: Props) {
  const pico = data.reduce(
    (max, m) => (m.total > max.total ? m : max),
    { mes: '', total: 0, valorMedio: 0 }
  )

  const TooltipContent = makeTooltip(data)

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4A7C6F" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#4A7C6F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
        <XAxis
          dataKey="mes"
          tick={{ fontSize: 10, fill: '#8A8A8A' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#8A8A8A' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
        />
        <Tooltip content={<TooltipContent />} />
        {pico.mes && (
          <ReferenceLine
            x={pico.mes}
            stroke="#F15A22"
            strokeDasharray="4 3"
            label={{
              value: 'Pico',
              position: 'top',
              fill: '#F15A22',
              fontSize: 10,
              fontFamily: 'var(--f-display)',
            }}
          />
        )}
        <Legend
          wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--f-body)', color: '#6E6E6B', paddingTop: '6px' }}
        />
        <Area
          type="monotone"
          dataKey="total"
          name="Transações"
          stroke="#4A7C6F"
          strokeWidth={2.5}
          fill="url(#colorTotal)"
          dot={<CustomDot />}
          activeDot={{ r: 5, fill: '#4A7C6F', stroke: 'white', strokeWidth: 2 }}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
