import { useState } from 'react'

interface MesEntry {
  mes: number
  label: string
  total: number
}

interface AnoRow {
  ano: number
  meses: MesEntry[]
}

interface Props {
  data: AnoRow[]
}

const MES_ABBR = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

function interpolate(value: number, max: number): string {
  if (max === 0 || value === 0) return 'rgba(248,248,245,0.8)'
  const t = Math.sqrt(value / max) // raiz quadrada para realçar diferenças pequenas
  const r = Math.round(74 + (248 - 74) * (1 - t))
  const g = Math.round(124 + (248 - 124) * (1 - t))
  const b = Math.round(111 + (245 - 111) * (1 - t))
  return `rgb(${r},${g},${b})`
}

export function HeatmapSazonalidade({ data }: Props) {
  const [tooltip, setTooltip] = useState<{ ano: number; mes: MesEntry } | null>(null)

  // Filtrar apenas anos com pelo menos 1 transação; mostrar últimos 10 anos relevantes
  const filtered = data.filter((r) => r.meses.some((m) => m.total > 0)).slice(-12)
  const maxTotal = Math.max(...filtered.flatMap((r) => r.meses.map((m) => m.total)))

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Header dos meses */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '40px repeat(12, 1fr)',
          gap: 3,
          marginBottom: 4,
        }}
      >
        <div />
        {MES_ABBR.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontSize: 10,
              color: '#8A8A8A',
              fontFamily: 'var(--f-display)',
              fontWeight: 600,
            }}
          >
            {m}
          </div>
        ))}
      </div>

      {/* Grid de células */}
      {filtered.map((row) => (
        <div
          key={row.ano}
          style={{
            display: 'grid',
            gridTemplateColumns: '40px repeat(12, 1fr)',
            gap: 3,
            marginBottom: 3,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: '#6E6E6B',
              fontFamily: 'var(--f-mono)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 4,
            }}
          >
            {row.ano}
          </div>
          {row.meses.map((mes) => (
            <div
              key={mes.mes}
              title={`${mes.label}/${row.ano}: ${mes.total.toLocaleString('pt-BR')} transações`}
              onMouseEnter={() => setTooltip({ ano: row.ano, mes })}
              onMouseLeave={() => setTooltip(null)}
              style={{
                height: 20,
                borderRadius: 3,
                background: interpolate(mes.total, maxTotal),
                cursor: mes.total > 0 ? 'pointer' : 'default',
                border: '1px solid rgba(0,0,0,0.04)',
                transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                transform:
                  tooltip?.ano === row.ano && tooltip?.mes.mes === mes.mes
                    ? 'scale(1.15)'
                    : 'scale(1)',
                boxShadow:
                  tooltip?.ano === row.ano && tooltip?.mes.mes === mes.mes
                    ? '0 2px 8px rgba(74,124,111,0.35)'
                    : 'none',
                position: 'relative',
                zIndex:
                  tooltip?.ano === row.ano && tooltip?.mes.mes === mes.mes ? 10 : 1,
              }}
            />
          ))}
        </div>
      ))}

      {/* Tooltip flutuante */}
      {tooltip && (
        <div
          className="rounded-xl p-2.5 text-xs shadow-lg mt-2"
          style={{ background: 'white', border: '1px solid #E8E6DF', maxWidth: 200 }}
        >
          <div className="font-bold mb-1" style={{ color: '#1A1A1A', fontFamily: 'var(--f-display)' }}>
            {tooltip.mes.label}/{tooltip.ano}
          </div>
          <div style={{ color: '#4A4A4A' }}>
            {tooltip.mes.total.toLocaleString('pt-BR')} transações
          </div>
        </div>
      )}

      {/* Legenda de escala */}
      <div className="flex items-center gap-2 mt-3">
        <span style={{ fontSize: 9, color: '#8A8A8A' }}>0</span>
        <div
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            background: 'linear-gradient(to right, rgba(248,248,245,0.8), #4A7C6F)',
          }}
        />
        <span style={{ fontSize: 9, color: '#8A8A8A' }}>{maxTotal.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}
