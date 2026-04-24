import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useFilterContext } from '../../context/FilterContext'
import { formatBRL } from '../../utils/formatters'

interface BairroM2Data {
  bairro: string
  valorMedio: number
}

interface Props {
  data: BairroM2Data[]
}

export function ValorM2Bairros({ data }: Props) {
  const { filters, toggleBairro } = useFilterContext()

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
        <XAxis type="number" tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} tickFormatter={(v) => formatBRL(Number(v))} />
        <YAxis dataKey="bairro" type="category" tick={{ fontSize: 9, fill: '#8A8A8A' }} tickLine={false} axisLine={false} width={90} />
        <Tooltip
          formatter={(v) => [formatBRL(Number(v)), 'Valor médio/m²']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E6DF' }}
        />
        <Bar dataKey="valorMedio" radius={[0, 4, 4, 0]} cursor="pointer" onClick={(d) => toggleBairro((d as unknown as BairroM2Data).bairro)}>
          {data.map((entry) => {
            const selected = filters.bairros.includes(entry.bairro)
            const hasFilter = filters.bairros.length > 0
            return (
              <Cell
                key={entry.bairro}
                fill="#F59E0B"
                opacity={hasFilter && !selected ? 0.3 : 1}
              />
            )
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
