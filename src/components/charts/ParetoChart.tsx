import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell, Legend,
} from 'recharts'

interface ParetoItem {
  bairro: string
  total: number
  pctAcum: number
}

interface Props {
  data: ParetoItem[]
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; name: string; dataKey: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const bar = payload.find((p) => p.dataKey === 'total')
  const line = payload.find((p) => p.dataKey === 'pctAcum')
  return (
    <div
      className="rounded-xl p-3 text-xs shadow-lg"
      style={{ background: 'white', border: '1px solid #E8E6DF', minWidth: 180 }}
    >
      <div className="font-bold mb-2" style={{ color: '#1A1A1A', fontFamily: 'var(--f-display)' }}>
        {label}
      </div>
      {bar && (
        <div className="flex items-center gap-1.5 mb-1" style={{ color: '#4A4A4A' }}>
          <span>{Number(bar.value).toLocaleString('pt-BR')} transações</span>
        </div>
      )}
      {line && (
        <div className="flex items-center gap-1.5" style={{ color: '#F15A22' }}>
          <span>Acumulado: {Number(line.value).toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}

export function ParetoChart({ data }: Props) {
  // Mostrar top 40 para o gráfico não ficar ilegível
  const displayData = data.slice(0, 40)

  // Bairro onde atinge 80%
  const marco80 = displayData.find((d) => d.pctAcum >= 80)
  const bairros80 = marco80 ? data.indexOf(marco80) + 1 : data.length

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={displayData} margin={{ top: 12, right: 40, left: -10, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" vertical={false} />
        <XAxis
          dataKey="bairro"
          tick={{ fontSize: 9, fill: '#8A8A8A', angle: -45, textAnchor: 'end' }}
          tickLine={false}
          axisLine={false}
          interval={0}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 10, fill: '#8A8A8A' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: '#F15A22' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--f-body)', color: '#6E6E6B', paddingTop: '4px' }} />

        {/* Linha de 80% */}
        <ReferenceLine
          yAxisId="right"
          y={80}
          stroke="#EF4444"
          strokeDasharray="5 3"
          label={{
            value: '80% do volume',
            position: 'insideTopRight',
            fill: '#EF4444',
            fontSize: 10,
            fontFamily: 'var(--f-display)',
          }}
        />

        {/* Linha vertical no bairro marco */}
        {marco80 && (
          <ReferenceLine
            yAxisId="left"
            x={marco80.bairro}
            stroke="#EF4444"
            strokeDasharray="5 3"
            label={{
              value: `${bairros80} bairros`,
              position: 'top',
              fill: '#EF4444',
              fontSize: 10,
              fontFamily: 'var(--f-display)',
            }}
          />
        )}

        <Bar yAxisId="left" dataKey="total" name="Transações" isAnimationActive radius={[2, 2, 0, 0]}>
          {displayData.map((entry, i) => (
            <Cell
              key={entry.bairro}
              fill={entry.pctAcum <= 80 ? '#4A7C6F' : '#A8C5BE'}
              opacity={i % 2 === 0 ? 1 : 0.85}
            />
          ))}
        </Bar>

        <Line
          yAxisId="right"
          type="monotone"
          dataKey="pctAcum"
          name="% Acumulado"
          stroke="#F15A22"
          strokeWidth={2}
          dot={false}
          isAnimationActive
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
