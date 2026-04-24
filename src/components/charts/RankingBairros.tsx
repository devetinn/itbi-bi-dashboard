import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useFilterContext } from '../../context/FilterContext'

interface BairroData {
  bairro: string
  total: number
  valorMedio: number
}

interface Props {
  data: BairroData[]
}

export function RankingBairros({ data }: Props) {
  const { filters, toggleBairro } = useFilterContext()

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
        <XAxis type="number" tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} />
        <YAxis dataKey="bairro" type="category" tick={{ fontSize: 9, fill: '#8A8A8A' }} tickLine={false} axisLine={false} width={90} />
        <Tooltip
          formatter={(v) => [Number(v).toLocaleString('pt-BR'), 'Transações']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E6DF' }}
        />
        <Bar dataKey="total" radius={[0, 4, 4, 0]} cursor="pointer" onClick={(d) => toggleBairro((d as unknown as BairroData).bairro)}>
          {data.map((entry) => {
            const selected = filters.bairros.includes(entry.bairro)
            const hasFilter = filters.bairros.length > 0
            return (
              <Cell
                key={entry.bairro}
                fill={selected ? '#2D6A5F' : '#4A7C6F'}
                opacity={hasFilter && !selected ? 0.3 : 1}
              />
            )
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
