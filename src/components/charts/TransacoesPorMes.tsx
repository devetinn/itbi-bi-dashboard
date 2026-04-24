import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatBRL } from '../../utils/formatters'

interface Props {
  data: { mes: string; total: number; valorMedio: number }[]
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  const curr = payload[0]?.value ?? 0
  return (
    <div className="bg-white border border-[#E8E6DF] rounded-xl p-3 text-xs shadow-sm">
      <div className="font-semibold text-[#1A1A1A] mb-1">{label}</div>
      <div className="text-[#4A4A4A]">{curr.toLocaleString('pt-BR')} transações</div>
      {payload[1] && <div className="text-[#8A8A8A]">Médio: {formatBRL(payload[1].value)}</div>}
    </div>
  )
}

export function TransacoesPorMes({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4A7C6F" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#4A7C6F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
        <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="total" stroke="#4A7C6F" strokeWidth={2} fill="url(#colorTotal)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
