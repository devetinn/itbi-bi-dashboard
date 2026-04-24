import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { applyFilters } from '../utils/filterHelpers'

export interface ITBIRecord {
  bairro: string
  vl_base: number
  vl_m2_base: number
  tipo_uso: string
  padrao_construtivo: string
  data_transacao: string
  ano?: number
  mes?: number
  idade_imovel_anos?: number
}

export interface Filters {
  bairros: string[]
  faixasValor: string[]
  tiposUso: string[]
  anoRange: [number, number]
}

interface FilterContextType {
  filters: Filters
  setFilter: (key: keyof Filters, value: Filters[keyof Filters]) => void
  toggleBairro: (bairro: string) => void
  toggleFaixa: (faixa: string) => void
  toggleTipo: (tipo: string) => void
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
  anoRange: [2000, 2030],
}

const FilterContext = createContext<FilterContextType | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [allData, setAllData] = useState<ITBIRecord[]>([])

  const filteredData = applyFilters(allData, filters)

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

  const clearFilters = useCallback(() => setFilters(defaultFilters), [])

  const hasActiveFilters =
    filters.bairros.length > 0 ||
    filters.faixasValor.length > 0 ||
    filters.tiposUso.length > 0

  const activeCount = filters.bairros.length + filters.faixasValor.length + filters.tiposUso.length

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilter,
        toggleBairro,
        toggleFaixa,
        toggleTipo,
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
