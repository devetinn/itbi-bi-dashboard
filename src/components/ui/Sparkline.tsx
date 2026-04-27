import { ResponsiveContainer, Area, AreaChart } from 'recharts'

interface SparklineProps {
  data: number[]
  color?: string
  highlighted?: boolean
}

export function Sparkline({ data, color = '#F15A22', highlighted }: SparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }))
  const strokeColor = highlighted ? '#ffffff' : color
  const gradId = `sg-${strokeColor.replace('#', '')}`

  return (
    <div className="w-full h-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={strokeColor} stopOpacity={0.18} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={strokeColor}
            strokeWidth={1.5}
            fill={`url(#${gradId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
