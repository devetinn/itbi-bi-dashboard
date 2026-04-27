import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
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

export function TipoUsoDonut({ data }: Props) {
  const { filters, toggleTipo } = useFilterContext()
  const [activeIndex, setActiveIndex] = useState(-1)

  const total = data.reduce((s, d) => s + d.total, 0)

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              dataKey="total"
              nameKey="tipo"
              cursor="pointer"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
              onClick={(d) => toggleTipo((d as unknown as TipoData).tipo)}
              labelLine={false}
              isAnimationActive
            >
              {data.map((entry, i) => {
                const selected = filters.tiposUso.includes(entry.tipo)
                const hasFilter = filters.tiposUso.length > 0
                const isActive = activeIndex === i
                return (
                  <Cell
                    key={entry.tipo}
                    fill={COLORS[i % COLORS.length]}
                    opacity={hasFilter && !selected ? 0.3 : 1}
                    style={{
                      transform: isActive ? 'scale(1.06)' : 'scale(1)',
                      transformOrigin: 'center',
                      transformBox: 'fill-box',
                      transition: 'transform 0.2s ease',
                    }}
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

        {/* Centro do donut */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            className="font-bold tabular-nums"
            style={{ fontSize: 18, color: '#1A1A1A', fontFamily: 'var(--f-display)', lineHeight: 1.1 }}
          >
            {total.toLocaleString('pt-BR')}
          </div>
          <div style={{ fontSize: 10, color: '#8A8A8A', fontFamily: 'var(--f-body)' }}>
            Total
          </div>
        </div>
      </div>

      {/* Legenda customizada */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 px-2">
        {data.map((d, i) => (
          <button
            key={d.tipo}
            onClick={() => toggleTipo(d.tipo)}
            className="flex items-center gap-1 text-[10px] transition-opacity"
            style={{
              fontFamily: 'var(--f-body)',
              color: '#4A4A4A',
              opacity: filters.tiposUso.length > 0 && !filters.tiposUso.includes(d.tipo) ? 0.4 : 1,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: COLORS[i % COLORS.length],
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span>{d.tipo.replace('RESIDENCIAL', 'Resid.').replace('COMERCIAL', 'Comer.')}</span>
            <span style={{ color: '#8A8A8A' }}>({d.pct.toFixed(1)}%)</span>
          </button>
        ))}
      </div>
    </div>
  )
}
