import { useEffect } from 'react'
import Papa from 'papaparse'
import { useFilterContext, type ITBIRecord } from '../context/FilterContext'
import { formatBRL, formatCount } from '../utils/formatters'
import { getFaixa } from '../utils/filterHelpers'

const MES_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function useITBIData() {
  const { filteredData, allData, setAllData } = useFilterContext()

  useEffect(() => {
    if (allData.length > 0) return
    Papa.parse<Record<string, string>>('/itbi_clean.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = results.data
          .filter((r) => r.bairro && r.vl_base)
          .map((r) => {
            const raw = r as unknown as ITBIRecord & Record<string, string | number>
            const vl_base = Number(raw.vl_base) || 0
            const vl_m2_base = Number(raw.vl_m2_base) || 0
            const data_transacao = String(raw.data_transacao || '')
            const ano = Number(raw.ano) || (data_transacao ? new Date(data_transacao).getFullYear() : 0)
            const mes = Number(raw.mes) || (data_transacao ? new Date(data_transacao).getMonth() + 1 : 0)
            return {
              bairro: String(raw.bairro || '').trim(),
              vl_base,
              vl_m2_base,
              tipo_uso: String(raw.tipo_uso || 'Residencial').trim(),
              padrao_construtivo: String(raw.padrao_construtivo || '').trim(),
              data_transacao,
              ano,
              mes,
              idade_imovel_anos: raw.idade_imovel_anos != null ? Number(raw.idade_imovel_anos) : undefined,
            } satisfies ITBIRecord
          })
        setAllData(rows)
      },
    })
  }, [allData.length, setAllData])

  const data = filteredData.length > 0 ? filteredData : allData

  // KPIs
  const totalTransacoes = data.length
  const valorTotal = data.reduce((s, r) => s + r.vl_base, 0)
  const ticketMedio = totalTransacoes > 0 ? valorTotal / totalTransacoes : 0

  const bairrosSet = new Set(data.map((r) => r.bairro))

  // Sparkline dos últimos 12 meses
  const mesCounts: Record<string, number> = {}
  data.forEach((r) => {
    const key = `${r.ano}-${String(r.mes).padStart(2, '0')}`
    mesCounts[key] = (mesCounts[key] || 0) + 1
  })
  const sorted = Object.keys(mesCounts).sort()
  const last12 = sorted.slice(-12)
  const sparklineTransacoes = last12.map((k) => mesCounts[k])

  // Transações por mês
  const mesMap: Record<string, { total: number; soma: number }> = {}
  data.forEach((r) => {
    const key = `${r.ano}-${String(r.mes).padStart(2, '0')}`
    if (!mesMap[key]) mesMap[key] = { total: 0, soma: 0 }
    mesMap[key].total++
    mesMap[key].soma += r.vl_base
  })
  const transacoesPorMes = Object.entries(mesMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => {
      const [ano, mesNum] = key.split('-')
      return {
        mes: `${MES_LABELS[parseInt(mesNum) - 1]}/${ano.slice(2)}`,
        total: v.total,
        valorMedio: v.soma / v.total,
      }
    })

  // Mês de pico
  const pico = transacoesPorMes.reduce((max, m) => (m.total > max.total ? m : max), { mes: '-', total: 0, valorMedio: 0 })

  // Ranking bairros
  const bairroMap: Record<string, { total: number; soma: number }> = {}
  data.forEach((r) => {
    if (!bairroMap[r.bairro]) bairroMap[r.bairro] = { total: 0, soma: 0 }
    bairroMap[r.bairro].total++
    bairroMap[r.bairro].soma += r.vl_base
  })
  const rankingBairros = Object.entries(bairroMap)
    .map(([bairro, v]) => ({ bairro, total: v.total, valorMedio: v.soma / v.total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15)

  const topBairroTransacoes = rankingBairros[0] ?? { bairro: '-', total: 0 }

  // Valor m² por bairro
  const m2Map: Record<string, { soma: number; count: number }> = {}
  data.forEach((r) => {
    if (!r.vl_m2_base) return
    if (!m2Map[r.bairro]) m2Map[r.bairro] = { soma: 0, count: 0 }
    m2Map[r.bairro].soma += r.vl_m2_base
    m2Map[r.bairro].count++
  })
  const valorM2Bairros = Object.entries(m2Map)
    .map(([bairro, v]) => ({ bairro, valorMedio: v.soma / v.count }))
    .sort((a, b) => b.valorMedio - a.valorMedio)
    .slice(0, 20)

  const topBairroM2 = valorM2Bairros[0] ?? { bairro: '-', valorMedio: 0 }

  // Concentração 80% do valor
  const sortedByValor = Object.entries(bairroMap)
    .map(([bairro, v]) => ({ bairro, soma: v.soma }))
    .sort((a, b) => b.soma - a.soma)
  const total80 = valorTotal * 0.8
  let acc = 0; let count80 = 0
  for (const b of sortedByValor) { acc += b.soma; count80++; if (acc >= total80) break }

  // Faixa de valor
  const faixaMap: Record<string, number> = {}
  data.forEach((r) => {
    const f = getFaixa(r.vl_base)
    faixaMap[f] = (faixaMap[f] || 0) + 1
  })
  const faixaOrdem = ['Até 100k', '100k–300k', '300k–500k', '500k–1M', 'Acima de 1M']
  const faixaValor = faixaOrdem.map((f) => ({
    faixa: f,
    total: faixaMap[f] || 0,
    pct: totalTransacoes > 0 ? `${(((faixaMap[f] || 0) / totalTransacoes) * 100).toFixed(1)}%` : '0%',
  }))

  // Tipo de uso
  const tipoMap: Record<string, number> = {}
  data.forEach((r) => { tipoMap[r.tipo_uso] = (tipoMap[r.tipo_uso] || 0) + 1 })
  const tipoUso = Object.entries(tipoMap)
    .map(([tipo, total]) => ({ tipo, total, pct: totalTransacoes > 0 ? (total / totalTransacoes) * 100 : 0 }))
    .sort((a, b) => b.total - a.total)

  const pctResidencial = tipoUso.find((t) => t.tipo.toLowerCase().includes('resid'))?.pct ?? 0
  const pctHabitacional = tipoUso.find((t) => t.tipo.toLowerCase().includes('habit'))?.pct ?? 0

  // Padrão construtivo
  const padraoMap: Record<string, number> = {}
  data.forEach((r) => { if (r.padrao_construtivo) padraoMap[r.padrao_construtivo] = (padraoMap[r.padrao_construtivo] || 0) + 1 })
  const padraoConstrutivo = Object.entries(padraoMap)
    .map(([padrao, total]) => ({ padrao, total }))
    .sort((a, b) => a.padrao.localeCompare(b.padrao))

  const padraoMaisComum = [...padraoConstrutivo].sort((a, b) => b.total - a.total)[0]?.padrao ?? '-'

  // Ticket médio luxo vs econômico
  const luxoTypes = data.filter((r) => r.padrao_construtivo?.toLowerCase().includes('luxo'))
  const econTypes = data.filter((r) => r.padrao_construtivo?.toLowerCase().includes('econ') || r.padrao_construtivo?.toLowerCase().includes('simpl'))
  const ticketLuxo = luxoTypes.length > 0 ? luxoTypes.reduce((s, r) => s + r.vl_base, 0) / luxoTypes.length : 0
  const ticketEcon = econTypes.length > 0 ? econTypes.reduce((s, r) => s + r.vl_base, 0) / econTypes.length : 0

  // Sazonalidade (por mês do ano 1-12)
  const sazMap: Record<number, number> = {}
  data.forEach((r) => { if (r.mes) sazMap[r.mes] = (sazMap[r.mes] || 0) + 1 })
  const sazonalidadeGrid = Array.from({ length: 12 }, (_, i) => ({
    mes: i + 1,
    label: MES_LABELS[i],
    total: sazMap[i + 1] || 0,
  }))

  // Scatter idade × valor/m²
  const scatterData = data
    .filter((r) => r.idade_imovel_anos != null && r.vl_m2_base > 0)
    .map((r) => ({ x: r.idade_imovel_anos!, y: r.vl_m2_base, bairro: r.bairro }))
    .slice(0, 2000)

  // Treemap
  const treemapData = Object.entries(bairroMap)
    .map(([name, v]) => {
      const m2 = m2Map[name]
      return { name, size: v.total, valorMedio: m2 ? m2.soma / m2.count : 0 }
    })
    .sort((a, b) => b.size - a.size)
    .slice(0, 40)

  return {
    loading: allData.length === 0,
    kpis: {
      totalTransacoes,
      valorTotalMovimentado: formatBRL(valorTotal),
      ticketMedio: formatBRL(ticketMedio),
      totalBairros: bairrosSet.size,
      sparklineTransacoes,
      mesPico: pico.mes,
      topBairroTransacoes,
      topBairroM2,
      count80Bairros: count80,
      pctResidencial,
      pctHabitacional,
      padraoMaisComum,
      ticketLuxo: formatBRL(ticketLuxo),
      ticketEcon: formatBRL(ticketEcon),
    },
    transacoesPorMes,
    rankingBairros,
    valorM2Bairros,
    faixaValor,
    tipoUso,
    padraoConstrutivo,
    sazonalidadeGrid,
    scatterData,
    treemapData,
    totalRegistros: formatCount(allData.length),
  }
}
