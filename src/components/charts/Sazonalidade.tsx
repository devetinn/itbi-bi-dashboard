import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props {
  data: { mes: number; label: string; total: number }[]
}

export function Sazonalidade({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8A8A8A' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(v) => [Number(v).toLocaleString('pt-BR'), 'Transações']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E6DF' }}
        />
        <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--f-body)', color: '#6E6E6B', paddingTop: '4px' }} />
        <Bar dataKey="total" name="Transações" fill="#4A7C6F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
