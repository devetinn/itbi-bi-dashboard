import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { useFilterContext } from '../../context/FilterContext'

interface BairroData {
  bairro: string
  total: number
  valorMedio: number
}

interface Props {
  data: BairroData[]
}

const TOP3_COLOR = '#4A7C6F'
const REST_COLOR = '#A8C5BE'

function CustomYTick({
  x, y, payload, index,
}: {
  x?: number
  y?: number
  payload?: { value: string }
  index?: number
}) {
  const rank = (index ?? 0) < 3 ? `${(index ?? 0) + 1}. ` : ''
  const label = `${rank}${payload?.value ?? ''}`
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={9} fill={index !== undefined && index < 3 ? '#325565' : '#8A8A8A'} fontWeight={index !== undefined && index < 3 ? 600 : 400}>
      {label}
    </text>
  )
}

export function RankingBairros({ data }: Props) {
  const { filters, toggleBairro } = useFilterContext()

  return (
    <div>
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 52, left: 4, bottom: 0 }}
      >
        <XAxis type="number" tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} />
        <YAxis
          dataKey="bairro"
          type="category"
          tick={<CustomYTick />}
          tickLine={false}
          axisLine={false}
          width={95}
        />
        <Tooltip
          formatter={(v) => [Number(v).toLocaleString('pt-BR'), 'Transações']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E6DF' }}
        />
        <Bar
          dataKey="total"
          radius={[0, 4, 4, 0]}
          cursor="pointer"
          isAnimationActive
          onClick={(d) => toggleBairro((d as unknown as BairroData).bairro)}
        >
          <LabelList
            dataKey="total"
            position="right"
            formatter={(v: unknown) => Number(v).toLocaleString('pt-BR')}
            style={{ fontSize: 9, fill: '#6E6E6B', fontFamily: 'var(--f-mono)' }}
          />
          {data.map((entry, i) => {
            const selected = filters.bairros.includes(entry.bairro)
            const hasFilter = filters.bairros.length > 0
            return (
              <Cell
                key={entry.bairro}
                fill={selected ? '#2D6A5F' : i < 3 ? TOP3_COLOR : REST_COLOR}
                opacity={hasFilter && !selected ? 0.3 : 1}
              />
            )
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginTop: 6, fontSize: 11, color: '#6E6E6B', fontFamily: 'var(--f-body)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 10, height: 10, background: TOP3_COLOR, borderRadius: 2, display: 'inline-block' }} />
        Top 3
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 10, height: 10, background: REST_COLOR, borderRadius: 2, display: 'inline-block' }} />
        Demais bairros
      </span>
    </div>
    </div>
  )
}
