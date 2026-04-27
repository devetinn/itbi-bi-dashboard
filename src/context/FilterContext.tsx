import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import { applyFilters } from '../utils/filterHelpers'

export interface ITBIRecord {
  bairro: string
  vl_base_calculo: number | null
  vl_m2_base: number | null
  tipo_uso: string
  padrao_construcao: string | null
  nome_zoneamento: string | null
  data_transacao_itbi: string | null
  data_cadastramento: string | null
  ano_debito: number | null
  mes_debito: number | null
  idade_imovel_anos: number | null
  faixa_valor: string
  categoria_uso: string
  x_sirgas: number | null
  y_sirgas: number | null
}

export interface Filters {
  bairros: string[]
  faixasValor: string[]
  tiposUso: string[]
  padraosConstrucao: string[]
  anos: number[]
  anoRange: [number, number]
}

interface FilterContextType {
  filters: Filters
  setFilter: (key: keyof Filters, value: Filters[keyof Filters]) => void
  toggleBairro: (bairro: string) => void
  toggleFaixa: (faixa: string) => void
  toggleTipo: (tipo: string) => void
  togglePadrao: (padrao: string) => void
  toggleAno: (ano: number) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  filteredData: ITBIRecord[]
  allData: ITBIRecord[]
  setAllData: (data: ITBIRecord[]) => void
  activeCount: number
}

const defaultFilters: Filters = {
  bairros: [],
  faixasValor: [],
  tiposUso: [],
  padraosConstrucao: [],
  anos: [],
  anoRange: [2000, 2030],
}

const FilterContext = createContext<FilterContextType | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [allData, setAllData] = useState<ITBIRecord[]>([])

  const filteredData = useMemo(() => applyFilters(allData, filters), [allData, filters])

  const setFilter = useCallback((key: keyof Filters, value: Filters[keyof Filters]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleBairro = useCallback((bairro: string) => {
    setFilters((prev) => ({
      ...prev,
      bairros: prev.bairros.includes(bairro)
        ? prev.bairros.filter((b) => b !== bairro)
        : [...prev.bairros, bairro],
    }))
  }, [])

  const toggleFaixa = useCallback((faixa: string) => {
    setFilters((prev) => ({
      ...prev,
      faixasValor: prev.faixasValor.includes(faixa)
        ? prev.faixasValor.filter((f) => f !== faixa)
        : [...prev.faixasValor, faixa],
    }))
  }, [])

  const toggleTipo = useCallback((tipo: string) => {
    setFilters((prev) => ({
      ...prev,
      tiposUso: prev.tiposUso.includes(tipo)
        ? prev.tiposUso.filter((t) => t !== tipo)
        : [...prev.tiposUso, tipo],
    }))
  }, [])

  const togglePadrao = useCallback((padrao: string) => {
    setFilters((prev) => ({
      ...prev,
      padraosConstrucao: prev.padraosConstrucao.includes(padrao)
        ? prev.padraosConstrucao.filter((p) => p !== padrao)
        : [...prev.padraosConstrucao, padrao],
    }))
  }, [])

  const toggleAno = useCallback((ano: number) => {
    setFilters((prev) => ({
      ...prev,
      anos: prev.anos.includes(ano)
        ? prev.anos.filter((a) => a !== ano)
        : [...prev.anos, ano],
    }))
  }, [])

  const clearFilters = useCallback(() => setFilters(defaultFilters), [])

  const hasActiveFilters =
    filters.bairros.length > 0 ||
    filters.faixasValor.length > 0 ||
    filters.tiposUso.length > 0 ||
    filters.padraosConstrucao.length > 0 ||
    filters.anos.length > 0

  const activeCount =
    filters.bairros.length +
    filters.faixasValor.length +
    filters.tiposUso.length +
    filters.padraosConstrucao.length +
    filters.anos.length

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilter,
        toggleBairro,
        toggleFaixa,
        toggleTipo,
        togglePadrao,
        toggleAno,
        clearFilters,
        hasActiveFilters,
        filteredData,
        allData,
        setAllData,
        activeCount,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilterContext() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilterContext must be inside FilterProvider')
  return ctx
}
