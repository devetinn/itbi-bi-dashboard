import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  data: { padrao: string; total: number }[]
}

function getColor(index: number, total: number): string {
  const ratio = total > 1 ? index / (total - 1) : 0
  const r = Math.round(197 + (45 - 197) * ratio)
  const g = Math.round(221 + (106 - 221) * ratio)
  const b = Math.round(216 + (95 - 216) * ratio)
  return `rgb(${r},${g},${b})`
}

export function PadraoConstrutivo({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
        <XAxis dataKey="padrao" tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(v) => [Number(v).toLocaleString('pt-BR'), 'Transações']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E6DF' }}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={getColor(i, data.length)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
