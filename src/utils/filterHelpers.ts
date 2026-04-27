import type { ITBIRecord, Filters } from '../context/FilterContext'

export function applyFilters(data: ITBIRecord[], filters: Filters): ITBIRecord[] {
  return data.filter((row) => {
    if (filters.bairros.length > 0 && !filters.bairros.includes(row.bairro)) return false
    if (filters.faixasValor.length > 0 && !filters.faixasValor.includes(row.faixa_valor)) return false
    if (filters.tiposUso.length > 0 && !filters.tiposUso.includes(row.tipo_uso)) return false
    if (filters.padraosConstrucao.length > 0 && !filters.padraosConstrucao.includes(row.padrao_construcao ?? '')) return false
    if (filters.anos.length > 0 && row.ano_debito !== null && !filters.anos.includes(row.ano_debito)) return false
    const ano = row.ano_debito
    if (ano !== null && (ano < filters.anoRange[0] || ano > filters.anoRange[1])) return false
    return true
  })
}

export const FAIXA_LABELS: Record<string, string> = {
  ATE_100K:    'Até 100k',
  '100K_300K': '100k–300k',
  '300K_600K': '300k–600k',
  '600K_1M':   '600k–1M',
  ACIMA_1M:    'Acima de 1M',
  DESCONHECIDO:'Desconhecido',
}

export const FAIXA_ORDER = ['ATE_100K', '100K_300K', '300K_600K', '600K_1M', 'ACIMA_1M', 'DESCONHECIDO']
