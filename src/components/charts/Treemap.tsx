import { Treemap as RechartsTreemap, ResponsiveContainer, Tooltip } from 'recharts'
import { useFilterContext } from '../../context/FilterContext'
import { formatBRL, formatCount } from '../../utils/formatters'

interface TreemapEntry {
  name: string
  size: number
  valorMedio: number
  [key: string]: string | number
}

interface Props {
  data: TreemapEntry[]
}

function getColor(valorMedio: number, min: number, max: number): string {
  const ratio = max > min ? (valorMedio - min) / (max - min) : 0
  if (ratio < 0.5) {
    const t = ratio * 2
    const r = Math.round(197 + (74 - 197) * t)
    const g = Math.round(221 + (124 - 221) * t)
    const b = Math.round(216 + (111 - 216) * t)
    return `rgb(${r},${g},${b})`
  } else {
    const t = (ratio - 0.5) * 2
    const r = Math.round(74 + (26 - 74) * t)
    const g = Math.round(124 + (74 - 124) * t)
    const b = Math.round(111 + (63 - 111) * t)
    return `rgb(${r},${g},${b})`
  }
}

interface ContentProps {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  size?: number
  valorMedio?: number
  root?: { children?: TreemapEntry[] }
}

function CustomContent({ x = 0, y = 0, width = 0, height = 0, name, size, valorMedio, root }: ContentProps & { onClick?: (name: string) => void }) {
  const allValues = (root?.children ?? []).map((c) => c.valorMedio)
  const min = allValues.length ? Math.min(...allValues) : 0
  const max = allValues.length ? Math.max(...allValues) : 1
  const fill = getColor(valorMedio ?? 0, min, max)
  const area = width * height
  const showLabel = area > 4000 && name

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#F0EFEA" strokeWidth={2} rx={4} />
      {showLabel && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={Math.min(12, width / 6)} fontWeight={500}>
          {name}
        </text>
      )}
      {showLabel && size && height > 40 && (
        <text x={x + width / 2} y={y + height / 2 + 14} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.7)" fontSize={9}>
          {formatCount(size)}
        </text>
      )}
    </g>
  )
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: TreemapEntry }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-[#E8E6DF] rounded-xl p-3 text-xs shadow-sm">
      <div className="font-semibold text-[#1A1A1A]">{d.name}</div>
      <div className="text-[#4A4A4A]">{formatCount(d.size)} transações</div>
      <div className="text-[#4A4A4A]">Valor médio/m²: {formatBRL(d.valorMedio)}</div>
    </div>
  )
}

export function Treemap({ data }: Props) {
  const { toggleBairro } = useFilterContext()

  const handleClick = (d: unknown) => {
    const entry = d as TreemapEntry
    if (entry.name) toggleBairro(entry.name)
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsTreemap
        data={data}
        dataKey="size"
        aspectRatio={4 / 3}
        content={<CustomContent />}
        onClick={handleClick}
      >
        <Tooltip content={<CustomTooltip />} />
      </RechartsTreemap>
    </ResponsiveContainer>
  )
}
