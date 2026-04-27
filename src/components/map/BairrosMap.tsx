import { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import type { Layer, LeafletMouseEvent, PathOptions } from 'leaflet'
import { motion } from 'framer-motion'

export type MapMetric = 'qtd' | 'vl_total_mi' | 'ticket_k' | 'vl_m2'

export interface BairroStat {
  qtd: number
  vl_total_mi: number
  ticket_k: number
  vl_m2: number
}

interface BairrosMapProps {
  bairroStats: Record<string, BairroStat>
  onBairroClick?: (bairro: string) => void
  selectedBairros?: string[]
}

const METRIC_LABELS: Record<MapMetric, string> = {
  qtd:         'Transações',
  vl_total_mi: 'VGV (R$ mi)',
  ticket_k:    'Ticket (R$k)',
  vl_m2:       'R$/m²',
}

const COLOR_RAMP = ['#E8EEF1', '#B8D0DC', '#6FAACC', '#F15A22', '#C04617']

function getColor(val: number, min: number, max: number): string {
  if (max <= min || val <= 0) return COLOR_RAMP[0]
  const t = Math.min(1, (val - min) / (max - min))
  const idx = Math.min(COLOR_RAMP.length - 1, Math.floor(t * COLOR_RAMP.length))
  return COLOR_RAMP[idx]
}

// Component to invalidate map size when parent resizes
function MapResizer() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

type GeoData = GeoJSON.FeatureCollection

export function BairrosMap({ bairroStats, onBairroClick, selectedBairros = [] }: BairrosMapProps) {
  const [metric, setMetric] = useState<MapMetric>('qtd')
  const [geoData, setGeoData] = useState<GeoData | null>(null)
  const [tooltip, setTooltip] = useState<{ nome: string; stat: BairroStat; x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/fortaleza-bairros.json')
      .then((r) => r.json())
      .then((d) => setGeoData(d as GeoData))
      .catch(console.error)
  }, [])

  // Compute min/max for current metric
  const values = Object.values(bairroStats).map((s) => s[metric]).filter((v) => v > 0)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 1

  const styleFeature = useCallback((feature: GeoJSON.Feature | undefined): PathOptions => {
    if (!feature) return {}
    const nome = feature.properties?.NOME_NORM as string | undefined
    const stat = nome ? bairroStats[nome] : undefined
    const val = stat ? stat[metric] : 0
    const selected = nome ? selectedBairros.includes(nome) : false
    return {
      fillColor: selected ? '#F15A22' : getColor(val, min, max),
      fillOpacity: selected ? 0.88 : val > 0 ? 0.7 : 0.12,
      color: selected ? '#C04617' : '#FFFFFF',
      weight: selected ? 2.5 : 0.8,
    }
  }, [bairroStats, metric, min, max, selectedBairros])

  const onEachFeature = useCallback((feature: GeoJSON.Feature, layer: Layer) => {
    const nome = feature.properties?.NOME_NORM as string | undefined
    const displayNome = feature.properties?.Nome as string | undefined
    const stat = nome ? bairroStats[nome] : undefined

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        if (stat && nome && containerRef.current) {
          const bounds = containerRef.current.getBoundingClientRect()
          setTooltip({
            nome: displayNome ?? nome,
            stat,
            x: e.originalEvent.clientX - bounds.left,
            y: e.originalEvent.clientY - bounds.top,
          })
        }
        ;(e.target as { setStyle: (s: PathOptions) => void }).setStyle({ weight: 2.5, fillOpacity: 0.92 })
      },
      mouseout: (e: LeafletMouseEvent) => {
        setTooltip(null)
        ;(e.target as { setStyle: (s: PathOptions) => void }).setStyle(styleFeature(feature))
      },
      click: () => {
        if (nome && onBairroClick) onBairroClick(nome)
      },
    })
  }, [bairroStats, onBairroClick, styleFeature])

  const metricFmt = (stat: BairroStat) => {
    switch (metric) {
      case 'qtd':         return stat.qtd.toLocaleString('pt-BR') + ' transações'
      case 'vl_total_mi': return 'R$' + stat.vl_total_mi.toFixed(1) + ' mi'
      case 'ticket_k':    return 'R$' + stat.ticket_k.toFixed(0) + 'k'
      case 'vl_m2':       return 'R$' + stat.vl_m2.toFixed(0) + '/m²'
    }
  }

  return (
    <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden" style={{ height: 460 }}>
      {/* Metric selector */}
      <div
        className="absolute top-3 left-3 z-[1000] flex gap-0.5 p-1 rounded-lg shadow-md"
        style={{ background: 'rgba(255,255,255,0.97)', border: '1px solid #E7E4DC' }}
      >
        {(Object.keys(METRIC_LABELS) as MapMetric[]).map((m) => (
          <motion.button
            key={m}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMetric(m)}
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-150"
            style={{
              fontFamily: 'var(--f-display)',
              background: metric === m ? '#F15A22' : 'transparent',
              color: metric === m ? '#fff' : '#6E6E6B',
            }}
          >
            {METRIC_LABELS[m]}
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div
        className="absolute bottom-6 right-3 z-[1000] p-2.5 rounded-lg text-[10px]"
        style={{
          background: 'rgba(255,255,255,0.97)',
          border: '1px solid #E7E4DC',
          fontFamily: 'var(--f-display)',
          color: '#6E6E6B',
        }}
      >
        <div className="font-semibold mb-1.5 uppercase tracking-wider">{METRIC_LABELS[metric]}</div>
        <div className="flex items-center gap-1">
          {COLOR_RAMP.map((c, i) => (
            <div key={i} className="w-5 h-3 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <div className="flex justify-between mt-0.5" style={{ fontSize: 9 }}>
          <span>Baixo</span>
          <span>Alto</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-[1001] pointer-events-none rounded-lg shadow-xl p-3"
          style={{
            left: Math.min(tooltip.x + 12, (containerRef.current?.clientWidth ?? 400) - 180),
            top: Math.max(8, tooltip.y - 70),
            background: '#FFFFFF',
            border: '1px solid #E7E4DC',
            fontFamily: 'var(--f-body)',
            minWidth: 160,
          }}
        >
          <div className="font-bold mb-1 text-[13px]" style={{ fontFamily: 'var(--f-display)', color: '#1A1A1A' }}>
            {tooltip.nome}
          </div>
          <div className="text-[13px] font-semibold" style={{ color: '#F15A22' }}>{metricFmt(tooltip.stat)}</div>
          {metric !== 'qtd' && (
            <div className="text-[11px] mt-0.5" style={{ color: '#6E6E6B' }}>
              {tooltip.stat.qtd.toLocaleString('pt-BR')} transações
            </div>
          )}
          <div className="text-[10px] mt-1" style={{ color: '#9A9A95' }}>
            Clique para filtrar
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[-3.74, -38.53]}
        zoom={11}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={false}
      >
        <MapResizer />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          maxZoom={18}
          subdomains="abcd"
        />
        {geoData && (
          <GeoJSON
            key={`${metric}-${JSON.stringify(Object.keys(bairroStats).length)}-${selectedBairros.join(',')}`}
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Loading overlay */}
      {!geoData && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: '#E8EEF1', zIndex: 999 }}
        >
          <div style={{ fontFamily: 'var(--f-mono)', color: '#6E6E6B', fontSize: 12 }}>
            Carregando mapa de Fortaleza...
          </div>
        </div>
      )}
    </div>
  )
}
