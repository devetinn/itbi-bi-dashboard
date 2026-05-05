export function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length
  if (n !== y.length || n < 2) return 0

  const meanX = x.reduce((s, v) => s + v, 0) / n
  const meanY = y.reduce((s, v) => s + v, 0) / n

  let num = 0, denX = 0, denY = 0
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX
    const dy = y[i] - meanY
    num += dx * dy
    denX += dx * dx
    denY += dy * dy
  }

  const den = Math.sqrt(denX * denY)
  return den === 0 ? 0 : num / den
}

export function linearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
  const n = x.length
  if (n < 2) return { slope: 0, intercept: 0 }

  const meanX = x.reduce((s, v) => s + v, 0) / n
  const meanY = y.reduce((s, v) => s + v, 0) / n

  let num = 0, den = 0
  for (let i = 0; i < n; i++) {
    num += (x[i] - meanX) * (y[i] - meanY)
    den += (x[i] - meanX) ** 2
  }

  const slope = den === 0 ? 0 : num / den
  return { slope, intercept: meanY - slope * meanX }
}

export function descriptiveStats(arr: number[]): {
  count: number
  min: number
  max: number
  mean: number
  median: number
  stdDev: number
} {
  if (arr.length === 0) return { count: 0, min: 0, max: 0, mean: 0, median: 0, stdDev: 0 }

  const sorted = [...arr].sort((a, b) => a - b)
  const n = sorted.length
  const mean = arr.reduce((s, v) => s + v, 0) / n
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)]
  const variance = arr.reduce((s, v) => s + (v - mean) ** 2, 0) / n

  return {
    count: n,
    min: sorted[0],
    max: sorted[n - 1],
    mean,
    median,
    stdDev: Math.sqrt(variance),
  }
}

export function interpretCorrelation(r: number): { label: string; color: string } {
  const abs = Math.abs(r)
  const direction = r >= 0 ? 'positiva' : 'negativa'
  if (abs >= 0.7) return { label: `Forte ${direction} (r = ${r.toFixed(3)})`, color: r >= 0 ? '#009889' : '#F15A22' }
  if (abs >= 0.4) return { label: `Moderada ${direction} (r = ${r.toFixed(3)})`, color: r >= 0 ? '#00A0DC' : '#E8A838' }
  return { label: `Fraca ${direction} (r = ${r.toFixed(3)})`, color: '#8A8A8A' }
}
