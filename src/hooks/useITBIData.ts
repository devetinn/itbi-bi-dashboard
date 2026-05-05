import { useEffect } from 'react'
import Papa from 'papaparse'
import { useFilterContext, type ITBIRecord } from '../context/FilterContext'
import { formatBRL, formatCount } from '../utils/formatters'
import { FAIXA_LABELS, FAIXA_ORDER } from '../utils/filterHelpers'
import type { BairroStat } from '../components/map/BairrosMap'

const MES_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function nullableNumber(v: unknown): number | null {
  const n = Number(v)
  return v === '' || v === null || v === undefined || isNaN(n) ? null : n
}

export function useITBIData() {
  const { filteredData, allData, setAllData, hasActiveFilters } = useFilterContext()

  useEffect(() => {
    if (allData.length > 0) return
    Papa.parse<Record<string, string | number>>('/itbi_clean.csv', {
      download: true,
      header: true,
      dynamicTyping: false,
      complete: (results) => {
        const rows: ITBIRecord[] = results.data
          .filter((r) => r.bairro && String(r.bairro).trim() !== '')
          .map((r) => ({
            bairro: String(r.bairro ?? '').trim(),
            vl_base_calculo: nullableNumber(r.vl_base_calculo),
            vl_m2_base: nullableNumber(r.vl_m2_base),
            tipo_uso: String(r.tipo_uso ?? 'RESIDENCIAL').trim(),
            padrao_construcao: r.padrao_construcao ? String(r.padrao_construcao).trim() : null,
            nome_zoneamento: r.nome_zoneamento ? String(r.nome_zoneamento).trim() : null,
            data_transacao_itbi: r.data_transacao_itbi ? String(r.data_transacao_itbi).trim() : null,
            data_cadastramento: r.data_cadastramento ? String(r.data_cadastramento).trim() : null,
            ano_debito: nullableNumber(r.ano_debito),
            mes_debito: nullableNumber(r.mes_debito),
            idade_imovel_anos: nullableNumber(r.idade_imovel_anos),
            faixa_valor: String(r.faixa_valor ?? 'DESCONHECIDO').trim(),
            categoria_uso: String(r.categoria_uso ?? 'OUTROS').trim(),
            x_sirgas: nullableNumber(r.x_sirgas),
            y_sirgas: nullableNumber(r.y_sirgas),
          }))
        setAllData(rows)
      },
    })
  }, [allData.length, setAllData])

  const data = hasActiveFilters ? filteredData : allData

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const totalTransacoes = data.length
  const dataComValor = data.filter((r) => r.vl_base_calculo !== null && r.vl_base_calculo > 0)
  const valorTotal = dataComValor.reduce((s, r) => s + r.vl_base_calculo!, 0)
  const ticketMedio = dataComValor.length > 0 ? valorTotal / dataComValor.length : 0
  const bairrosSet = new Set(data.map((r) => r.bairro))

  // Sparkline últimos 12 meses
  const mesCounts: Record<string, number> = {}
  data.forEach((r) => {
    if (!r.ano_debito || !r.mes_debito) return
    const key = `${r.ano_debito}-${String(r.mes_debito).padStart(2, '0')}`
    mesCounts[key] = (mesCounts[key] || 0) + 1
  })
  const sortedKeys = Object.keys(mesCounts).sort()
  const sparklineTransacoes = sortedKeys.slice(-12).map((k) => mesCounts[k])

  // ── Transações por mês ────────────────────────────────────────────────────
  const mesMap: Record<string, { total: number; soma: number }> = {}
  data.forEach((r) => {
    if (!r.ano_debito || !r.mes_debito) return
    const key = `${r.ano_debito}-${String(r.mes_debito).padStart(2, '0')}`
    if (!mesMap[key]) mesMap[key] = { total: 0, soma: 0 }
    mesMap[key].total++
    if (r.vl_base_calculo) mesMap[key].soma += r.vl_base_calculo
  })
  const transacoesPorMes = Object.entries(mesMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => {
      const [ano, mesNum] = key.split('-')
      return {
        mes: `${MES_LABELS[parseInt(mesNum) - 1]}/${ano.slice(2)}`,
        total: v.total,
        valorMedio: v.total > 0 ? v.soma / v.total : 0,
      }
    })

  const pico = transacoesPorMes.reduce(
    (max, m) => (m.total > max.total ? m : max),
    { mes: '-', total: 0, valorMedio: 0 }
  )

  // ── Comparativo anual ─────────────────────────────────────────────────────
  const anoMap: Record<number, { qtd: number; soma: number }> = {}
  data.forEach((r) => {
    if (!r.ano_debito) return
    if (!anoMap[r.ano_debito]) anoMap[r.ano_debito] = { qtd: 0, soma: 0 }
    anoMap[r.ano_debito].qtd++
    if (r.vl_base_calculo) anoMap[r.ano_debito].soma += r.vl_base_calculo
  })
  const anoStats = Object.entries(anoMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([ano, v]) => ({
      ano: Number(ano),
      qtd: v.qtd,
      vgv: v.soma / 1_000_000,
    }))

  // ── Ranking bairros ───────────────────────────────────────────────────────
  const bairroMap: Record<string, { total: number; soma: number }> = {}
  data.forEach((r) => {
    if (!bairroMap[r.bairro]) bairroMap[r.bairro] = { total: 0, soma: 0 }
    bairroMap[r.bairro].total++
    if (r.vl_base_calculo) bairroMap[r.bairro].soma += r.vl_base_calculo
  })
  const rankingBairros = Object.entries(bairroMap)
    .map(([bairro, v]) => ({ bairro, total: v.total, valorMedio: v.total > 0 ? v.soma / v.total : 0 }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15)

  const topBairroTransacoes = rankingBairros[0] ?? { bairro: '-', total: 0 }

  // ── Valor m² por bairro ───────────────────────────────────────────────────
  const m2Map: Record<string, { soma: number; count: number }> = {}
  data.forEach((r) => {
    if (!r.vl_m2_base || r.vl_m2_base <= 0) return
    if (!m2Map[r.bairro]) m2Map[r.bairro] = { soma: 0, count: 0 }
    m2Map[r.bairro].soma += r.vl_m2_base
    m2Map[r.bairro].count++
  })
  const valorM2Bairros = Object.entries(m2Map)
    .map(([bairro, v]) => ({ bairro, valorMedio: v.soma / v.count }))
    .sort((a, b) => b.valorMedio - a.valorMedio)
    .slice(0, 20)

  const topBairroM2 = valorM2Bairros[0] ?? { bairro: '-', valorMedio: 0 }

  // ── Concentração 80% ──────────────────────────────────────────────────────
  const sortedByValor = Object.entries(bairroMap)
    .map(([b, v]) => ({ bairro: b, soma: v.soma }))
    .sort((a, b) => b.soma - a.soma)
  const meta80 = valorTotal * 0.8
  let acc = 0; let count80 = 0
  for (const b of sortedByValor) { acc += b.soma; count80++; if (acc >= meta80) break }

  // ── Faixa de valor ────────────────────────────────────────────────────────
  const faixaMap: Record<string, number> = {}
  data.forEach((r) => { faixaMap[r.faixa_valor] = (faixaMap[r.faixa_valor] || 0) + 1 })
  const faixaValor = FAIXA_ORDER
    .filter((f) => f !== 'DESCONHECIDO')
    .map((f) => ({
      faixa: f,
      label: FAIXA_LABELS[f],
      total: faixaMap[f] || 0,
      pct: totalTransacoes > 0 ? `${(((faixaMap[f] || 0) / totalTransacoes) * 100).toFixed(1)}%` : '0%',
    }))

  // ── Tipo de uso ───────────────────────────────────────────────────────────
  const tipoMap: Record<string, number> = {}
  data.forEach((r) => { tipoMap[r.tipo_uso] = (tipoMap[r.tipo_uso] || 0) + 1 })
  const tipoUso = Object.entries(tipoMap)
    .map(([tipo, total]) => ({ tipo, total, pct: totalTransacoes > 0 ? (total / totalTransacoes) * 100 : 0 }))
    .sort((a, b) => b.total - a.total)

  const pctResidencial = tipoUso.find((t) => t.tipo.toUpperCase().includes('RESID'))?.pct ?? 0
  const pctHabitacional = tipoUso.find((t) => t.tipo.toUpperCase().includes('HABIT') || t.tipo.toUpperCase().includes('PROG'))?.pct ?? 0

  // ── Padrão construtivo ────────────────────────────────────────────────────
  const padraoMap: Record<string, number> = {}
  data.forEach((r) => {
    if (r.padrao_construcao) padraoMap[r.padrao_construcao] = (padraoMap[r.padrao_construcao] || 0) + 1
  })
  const padraoConstrutivo = Object.entries(padraoMap)
    .map(([padrao, total]) => ({ padrao, total }))
    .sort((a, b) => a.padrao.localeCompare(b.padrao))

  const padraoMaisComum = [...padraoConstrutivo].sort((a, b) => b.total - a.total)[0]?.padrao ?? '-'

  const luxo = data.filter((r) => r.padrao_construcao?.toUpperCase().includes('ALTO') || r.padrao_construcao?.toUpperCase().includes('LUXO'))
  const econ = data.filter((r) => r.padrao_construcao?.toUpperCase().includes('NORMAL') || r.padrao_construcao?.toUpperCase().includes('SIMPL') || r.padrao_construcao?.toUpperCase().includes('POPUL'))
  const luxoCom = luxo.filter((r) => r.vl_base_calculo)
  const econCom = econ.filter((r) => r.vl_base_calculo)
  const ticketLuxo = luxoCom.length > 0 ? luxoCom.reduce((s, r) => s + r.vl_base_calculo!, 0) / luxoCom.length : 0
  const ticketEcon = econCom.length > 0 ? econCom.reduce((s, r) => s + r.vl_base_calculo!, 0) / econCom.length : 0

  // ── Sazonalidade ──────────────────────────────────────────────────────────
  const sazMap: Record<number, number> = {}
  data.forEach((r) => { if (r.mes_debito) sazMap[r.mes_debito] = (sazMap[r.mes_debito] || 0) + 1 })
  const sazonalidadeGrid = Array.from({ length: 12 }, (_, i) => ({
    mes: i + 1, label: MES_LABELS[i], total: sazMap[i + 1] || 0,
  }))

  // ── Scatter idade × valor/m² ──────────────────────────────────────────────
  const scatterData = data
    .filter((r) => r.idade_imovel_anos !== null && r.vl_m2_base !== null && r.vl_m2_base > 0)
    .map((r) => ({ x: r.idade_imovel_anos!, y: r.vl_m2_base!, bairro: r.bairro }))
    .slice(0, 2000)

  // ── Zoneamento ────────────────────────────────────────────────────────────
  const zoneMap: Record<string, number> = {}
  data.forEach((r) => {
    if (!r.nome_zoneamento) return
    zoneMap[r.nome_zoneamento] = (zoneMap[r.nome_zoneamento] || 0) + 1
  })
  const zoneamentoData = Object.entries(zoneMap)
    .map(([zona, total]) => ({ zona, total, pct: totalTransacoes > 0 ? (total / totalTransacoes) * 100 : 0 }))
    .sort((a, b) => b.total - a.total)

  // ── Bairro stats para mapa ────────────────────────────────────────────────
  const bairroStats: Record<string, BairroStat> = {}
  const bairroM2: Record<string, { soma: number; count: number }> = {}
  data.forEach((r) => {
    const b = r.bairro
    if (!bairroStats[b]) bairroStats[b] = { qtd: 0, vl_total_mi: 0, ticket_k: 0, vl_m2: 0 }
    bairroStats[b].qtd++
    if (r.vl_base_calculo) bairroStats[b].vl_total_mi += r.vl_base_calculo / 1_000_000
    if (r.vl_m2_base && r.vl_m2_base > 0) {
      if (!bairroM2[b]) bairroM2[b] = { soma: 0, count: 0 }
      bairroM2[b].soma += r.vl_m2_base
      bairroM2[b].count++
    }
  })
  Object.entries(bairroStats).forEach(([b, s]) => {
    s.ticket_k = s.qtd > 0 ? (s.vl_total_mi * 1_000) / s.qtd : 0
    s.vl_m2 = bairroM2[b] ? bairroM2[b].soma / bairroM2[b].count : 0
  })

  // ── Treemap ───────────────────────────────────────────────────────────────
  const treemapData = Object.entries(bairroMap)
    .map(([name, v]) => {
      const m2 = m2Map[name]
      return { name, size: v.total, valorMedio: m2 ? m2.soma / m2.count : 0, [name]: v.total }
    })
    .sort((a, b) => b.size - a.size)
    .slice(0, 40)

  // ── Correlação: volume de transações × valor médio por bairro ───────────
  const correlacaoBairros = Object.entries(bairroMap)
    .filter(([b, v]) => v.total >= 10 && m2Map[b])
    .map(([bairro, v]) => ({
      bairro,
      totalTransacoes: v.total,
      valorMedio: v.soma > 0 && v.total > 0 ? v.soma / v.total : 0,
    }))
    .filter((d) => d.valorMedio > 0)

  // ── Pareto bairros (todos, com % acumulado) ───────────────────────────────
  const totalPareto = Object.values(bairroMap).reduce((s, v) => s + v.total, 0)
  let accumPareto = 0
  const paretoData = Object.entries(bairroMap)
    .map(([bairro, v]) => ({ bairro, total: v.total }))
    .sort((a, b) => b.total - a.total)
    .map((item) => {
      accumPareto += item.total
      return {
        bairro: item.bairro,
        total: item.total,
        pctAcum: totalPareto > 0 ? (accumPareto / totalPareto) * 100 : 0,
      }
    })

  // ── Heatmap sazonalidade (ano × mês) ─────────────────────────────────────
  const heatmapGrid: Record<number, Record<number, number>> = {}
  data.forEach((r) => {
    if (!r.ano_debito || !r.mes_debito) return
    if (!heatmapGrid[r.ano_debito]) heatmapGrid[r.ano_debito] = {}
    heatmapGrid[r.ano_debito][r.mes_debito] = (heatmapGrid[r.ano_debito][r.mes_debito] || 0) + 1
  })
  const heatmapData = Object.keys(heatmapGrid)
    .map(Number)
    .sort()
    .map((ano) => ({
      ano,
      meses: Array.from({ length: 12 }, (_, i) => ({
        mes: i + 1,
        label: MES_LABELS[i],
        total: heatmapGrid[ano][i + 1] || 0,
      })),
    }))

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
    correlacaoBairros,
    treemapData,
    anoStats,
    zoneamentoData,
    bairroStats,
    paretoData,
    heatmapData,
    totalRegistros: formatCount(allData.length),
    validationParams: {
      totalRegistros: data.length,
      bairrosUnicos: bairrosSet.size,
      registrosComValor: dataComValor.length,
      somaVlBaseCalculo: valorTotal,
      mediaVlBaseCalculo: ticketMedio,
    },
  }
}
