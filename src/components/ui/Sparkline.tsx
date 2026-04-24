import { ResponsiveContainer, Area, AreaChart } from 'recharts'

interface SparklineProps {
  data: number[]
  highlighted?: boolean
}

export function Sparkline({ data, highlighted }: SparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }))
  const color = highlighted ? '#ffffff' : '#4A7C6F'

  return (
    <div className="w-full h-12 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`sg-${highlighted ? 'h' : 'n'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#sg-${highlighted ? 'h' : 'n'})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
