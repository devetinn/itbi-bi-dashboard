import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from 'recharts'
import type { BarRectangleItem } from 'recharts/types/cartesian/Bar'
import { useFilterContext } from '../../context/FilterContext'

interface Props {
  data: { ano: number; qtd: number; vgv: number }[]
}

const COLORS = ['#325565', '#009889', '#F15A22', '#00A0DC']

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: { value: number; name: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg p-3 shadow-xl"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E7E4DC',
        fontFamily: 'var(--f-body)',
        minWidth: 140,
      }}
    >
      <div className="font-bold mb-2 text-[13px]" style={{ fontFamily: 'var(--f-display)', color: '#1A1A1A' }}>
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.name} className="text-[12px] flex justify-between gap-4">
          <span style={{ color: '#6E6E6B' }}>{p.name}</span>
          <span className="font-semibold" style={{ color: '#1A1A1A' }}>
            {p.value.toLocaleString('pt-BR')}
          </span>
        </div>
      ))}
    </div>
  )
}

export function AnoComparativo({ data }: Props) {
  const { toggleAno, filters } = useFilterContext()

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DC" vertical={false} />
        <XAxis
          dataKey="ano"
          tick={{ fontSize: 11, fontFamily: 'var(--f-display)', fill: '#6E6E6B' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'var(--f-mono)', fill: '#9A9A95' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,90,34,0.06)' }} />
        <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--f-body)', color: '#6E6E6B', paddingTop: '4px' }} />
        <Bar
          dataKey="qtd"
          name="Transações"
          radius={[4, 4, 0, 0]}
          cursor="pointer"
          onClick={(entry: BarRectangleItem) => { const d = entry as unknown as { ano?: number }; if (d.ano) toggleAno(d.ano) }}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.ano}
              fill={filters.anos.includes(entry.ano) ? '#F15A22' : COLORS[i % COLORS.length]}
              opacity={filters.anos.length === 0 || filters.anos.includes(entry.ano) ? 1 : 0.35}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
