import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatBRL } from '../../utils/formatters'

interface Props {
  data: { x: number; y: number; bairro: string }[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { x: number; y: number; bairro: string } }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-[#E8E6DF] rounded-xl p-3 text-xs shadow-sm">
      <div className="font-semibold text-[#1A1A1A]">{d.bairro}</div>
      <div className="text-[#4A4A4A]">Idade: {d.x} anos</div>
      <div className="text-[#4A4A4A]">Valor/m²: {formatBRL(d.y)}</div>
    </div>
  )
}

export function ScatterIdadeValor({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ScatterChart margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
        <XAxis dataKey="x" name="Idade" type="number" tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} label={{ value: 'Idade (anos)', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#8A8A8A' }} />
        <YAxis dataKey="y" name="Valor/m²" type="number" tick={{ fontSize: 10, fill: '#8A8A8A' }} tickLine={false} axisLine={false} tickFormatter={(v) => formatBRL(v)} />
        <Tooltip content={<CustomTooltip />} />
        <Scatter data={data} fill="#4A7C6F" fillOpacity={0.6} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
