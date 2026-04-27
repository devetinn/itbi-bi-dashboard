import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts'

interface Props {
  data: { zona: string; total: number; pct: number }[]
}

const ZONE_COLORS: Record<string, string> = {
  'ZR': '#009889',
  'ZC': '#F15A22',
  'ZI': '#325565',
  'ZE': '#00A0DC',
  'ZPA': '#9A9A95',
}

function zoneColor(zona: string): string {
  for (const prefix of Object.keys(ZONE_COLORS)) {
    if (zona.startsWith(prefix)) return ZONE_COLORS[prefix]
  }
  return '#D8D4C9'
}

const CustomTooltip = ({ active, payload }: {
  active?: boolean
  payload?: { value: number; payload: { zona: string; pct: number } }[]
}) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div
      className="rounded-lg p-3 shadow-xl"
      style={{ background: '#FFFFFF', border: '1px solid #E7E4DC', fontFamily: 'var(--f-body)' }}
    >
      <div className="font-bold text-[12px] mb-1" style={{ fontFamily: 'var(--f-display)', color: '#1A1A1A' }}>
        {d.payload.zona}
      </div>
      <div className="text-[12px]" style={{ color: '#6E6E6B' }}>
        {d.value.toLocaleString('pt-BR')} transações
      </div>
      <div className="text-[11px]" style={{ color: '#F15A22' }}>
        {d.payload.pct.toFixed(1)}% do total
      </div>
    </div>
  )
}

  export function ZoneamentoChart({ data }: Props) {
    const top = data.slice(0, 12)
    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={top}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 20, bottom: 20 }}
          barCategoryGap="15%"
        >
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DC" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fontFamily: 'var(--f-mono)', fill: '#9A9A95' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)}
        />
        <YAxis
          type="category"
          dataKey="zona"
          tick={{ fontSize: 10, fontFamily: 'var(--f-display)', fill: '#414042' }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,90,34,0.05)' }} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
        <Bar dataKey="total" name="Transações" radius={[0, 4, 4, 0]}>
          {top.map((entry) => (
            <Cell key={entry.zona} fill={zoneColor(entry.zona)} opacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
