import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  ReferenceLine, LabelList,
} from 'recharts'
import { useFilterContext } from '../../context/FilterContext'

interface FaixaData {
  faixa: string
  label: string
  total: number
  pct: string
}

interface Props {
  data: FaixaData[]
}

const FAIXA_COLORS = ['#C5DDD8', '#9BBFB8', '#6FA09A', '#4A7C6F', '#2D6A5F', '#1A4A40']

export function FaixaValorBar({ data }: Props) {
  const { filters, toggleFaixa } = useFilterContext()
  const meanTotal = data.length > 0
    ? data.reduce((s, d) => s + d.total, 0) / data.length
    : 0

  return (
    <div>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, left: 4, bottom: 0 }}>
        <XAxis type="number" tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} />
        <YAxis
          dataKey="label"
          type="category"
          tick={{ fontSize: 10, fill: '#8A8A8A' }}
          tickLine={false}
          axisLine={false}
          width={78}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E6DF' }}
          formatter={(v, _name, props) => {
            const entry = props.payload as FaixaData
            return [`${Number(v).toLocaleString('pt-BR')} (${entry?.pct ?? ''})`, 'Transações']
          }}
        />
        {meanTotal > 0 && (
          <ReferenceLine
            x={meanTotal}
            stroke="#F15A22"
            strokeDasharray="4 3"
            label={{
              value: 'Média',
              position: 'insideTopRight',
              fill: '#F15A22',
              fontSize: 9,
              fontFamily: 'var(--f-display)',
            }}
          />
        )}
        <Bar
          dataKey="total"
          radius={[0, 4, 4, 0]}
          cursor="pointer"
          isAnimationActive
          onClick={(d) => toggleFaixa((d as unknown as FaixaData).faixa)}
        >
          <LabelList
            dataKey="pct"
            position="right"
            style={{ fontSize: 9, fill: '#6E6E6B', fontFamily: 'var(--f-mono)' }}
          />
          {data.map((entry, i) => {
            const selected = filters.faixasValor.includes(entry.faixa)
            const hasFilter = filters.faixasValor.length > 0
            return (
              <Cell
                key={entry.faixa}
                fill={FAIXA_COLORS[i % FAIXA_COLORS.length]}
                opacity={hasFilter && !selected ? 0.3 : 1}
              />
            )
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginTop: 6, fontSize: 11, color: '#6E6E6B', fontFamily: 'var(--f-body)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 10, height: 10, background: '#4A7C6F', borderRadius: 2, display: 'inline-block' }} />
        Transações por faixa
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 14, borderTop: '2px dashed #F15A22', display: 'inline-block' }} />
        Média
      </span>
    </div>
    </div>
  )
}
