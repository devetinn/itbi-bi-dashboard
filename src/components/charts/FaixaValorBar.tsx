import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useFilterContext } from '../../context/FilterContext'

interface FaixaData {
  faixa: string
  total: number
  pct: string
}

interface Props {
  data: FaixaData[]
}

const COLORS = ['#C5DDD8', '#9BBFB8', '#6FA09A', '#4A7C6F', '#2D6A5F']

export function FaixaValorBar({ data }: Props) {
  const { filters, toggleFaixa } = useFilterContext()

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
        <XAxis type="number" tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} />
        <YAxis dataKey="faixa" type="category" tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} width={70} />
        <Tooltip
          formatter={(v) => [Number(v).toLocaleString('pt-BR'), 'Transações']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E6DF' }}
        />
        <Bar dataKey="total" radius={[0, 4, 4, 0]} cursor="pointer" onClick={(d) => toggleFaixa((d as unknown as FaixaData).faixa)}>
          {data.map((entry, i) => {
            const selected = filters.faixasValor.includes(entry.faixa)
            const hasFilter = filters.faixasValor.length > 0
            return (
              <Cell
                key={entry.faixa}
                fill={COLORS[i % COLORS.length]}
                opacity={hasFilter && !selected ? 0.3 : 1}
              />
            )
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
