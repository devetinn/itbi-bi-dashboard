import type { ITBIRecord, Filters } from '../context/FilterContext'

export function applyFilters(data: ITBIRecord[], filters: Filters): ITBIRecord[] {
  return data.filter((row) => {
    if (filters.bairros.length > 0 && !filters.bairros.includes(row.bairro)) return false
    if (filters.faixasValor.length > 0 && !filters.faixasValor.includes(getFaixa(row.vl_base))) return false
    if (filters.tiposUso.length > 0 && !filters.tiposUso.includes(row.tipo_uso)) return false
    const ano = row.ano ?? new Date(row.data_transacao).getFullYear()
    if (ano < filters.anoRange[0] || ano > filters.anoRange[1]) return false
    return true
  })
}

export function getFaixa(valor: number): string {
  if (valor < 100_000) return 'Até 100k'
  if (valor < 300_000) return '100k–300k'
  if (valor < 500_000) return '300k–500k'
  if (valor < 1_000_000) return '500k–1M'
  return 'Acima de 1M'
}
