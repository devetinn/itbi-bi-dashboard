import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, type PieLabelRenderProps } from 'recharts'
import { useFilterContext } from '../../context/FilterContext'

interface TipoData {
  tipo: string
  total: number
  pct: number
}

interface Props {
  data: TipoData[]
}

const COLORS = ['#4A7C6F', '#F59E0B', '#8A8A8A', '#C5DDD8', '#2D6A5F']

function renderLabel(props: PieLabelRenderProps & { tipo?: string; pct?: number }) {
  const { tipo, pct } = props
  if (!pct || pct <= 5) return null
  return <text>{String(tipo ?? '').slice(0, 8)}</text>
}

export function TipoUsoDonut({ data }: Props) {
  const { filters, toggleTipo } = useFilterContext()

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          dataKey="total"
          nameKey="tipo"
          cursor="pointer"
          onClick={(d) => toggleTipo((d as unknown as TipoData).tipo)}
          label={renderLabel}
          labelLine={false}
        >
          {data.map((entry, i) => {
            const selected = filters.tiposUso.includes(entry.tipo)
            const hasFilter = filters.tiposUso.length > 0
            return (
              <Cell
                key={entry.tipo}
                fill={COLORS[i % COLORS.length]}
                opacity={hasFilter && !selected ? 0.3 : 1}
              />
            )
          })}
        </Pie>
        <Tooltip
          formatter={(v, name) => [Number(v).toLocaleString('pt-BR'), String(name)]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E6DF' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
