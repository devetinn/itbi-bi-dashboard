import { useState } from 'react'
import { DATA_GROUND_TRUTH } from '../utils/dataValidation'

export function DataSourceBadge() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Clique para ver a metodologia completa"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
          width: '100%',
        }}
      >
        <div
          className="rounded-lg px-2.5 py-2 text-[10px] leading-relaxed"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span>📊</span>
            <span
              className="font-semibold"
              style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--f-display)' }}
            >
              {DATA_GROUND_TRUTH.totalRegistros.toLocaleString('pt-BR')} registros
            </span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.38)' }}>
            Fonte: SEFIN · Fortaleza
          </div>
          <div style={{ color: 'rgba(255,255,255,0.38)' }}>
            ETL: 🐍 Python
          </div>
        </div>
      </button>

      {open && (
        <div
          className="absolute rounded-xl p-4 text-xs shadow-2xl z-50"
          style={{
            bottom: 'calc(100% + 8px)',
            left: 0,
            width: 240,
            background: '#1F3845',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false) }}
            style={{
              position: 'absolute', top: 8, right: 8,
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontSize: 14,
            }}
          >
            ✕
          </button>

          <div
            className="font-bold mb-3"
            style={{ color: 'white', fontFamily: 'var(--f-display)', fontSize: 12 }}
          >
            Metodologia dos Dados
          </div>

          <div className="space-y-1.5">
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Fonte: </span>
              {DATA_GROUND_TRUTH.fonte}
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Total: </span>
              {DATA_GROUND_TRUTH.totalRegistros.toLocaleString('pt-BR')} registros
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Bairros: </span>
              {DATA_GROUND_TRUTH.bairrosUnicos} únicos
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Cobertura: </span>
              {DATA_GROUND_TRUTH.anosCobertura}
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Mês pico: </span>
              {DATA_GROUND_TRUTH.mesPicoTransacoes} ({DATA_GROUND_TRUTH.qtdMesPico.toLocaleString('pt-BR')} transações)
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>ETL: </span>
              {DATA_GROUND_TRUTH.etlRealizado}
            </div>
            <div
              className="mt-2 pt-2"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.35)',
                fontSize: 9,
              }}
            >
              ⚠️ {DATA_GROUND_TRUTH.observacao}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
