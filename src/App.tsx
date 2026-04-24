import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FilterProvider } from './context/FilterContext'
import { useITBIData } from './hooks/useITBIData'
import { Layout } from './components/layout/Layout'
import { SkeletonLoader } from './components/ui/SkeletonLoader'
import { PageTemporal } from './components/pages/PageTemporal'
import { PageEspacial } from './components/pages/PageEspacial'
import { PageMercado } from './components/pages/PageMercado'
import { PageExplorer } from './components/pages/PageExplorer'

const pageAnim = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.2 },
}

function Dashboard() {
  const [activePage, setActivePage] = useState('temporal')
  const data = useITBIData()

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      totalRegistros={data.totalRegistros}
      rawTotal={data.loading ? 0 : data.kpis.totalTransacoes}
    >
      {data.loading ? (
        <SkeletonLoader />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={activePage} {...pageAnim} className="h-full">
            {activePage === 'temporal' && (
              <PageTemporal
                kpis={data.kpis}
                transacoesPorMes={data.transacoesPorMes}
                faixaValor={data.faixaValor}
                sazonalidadeGrid={data.sazonalidadeGrid}
              />
            )}
            {activePage === 'espacial' && (
              <PageEspacial
                kpis={data.kpis}
                rankingBairros={data.rankingBairros}
                valorM2Bairros={data.valorM2Bairros}
              />
            )}
            {activePage === 'mercado' && (
              <PageMercado
                kpis={data.kpis}
                tipoUso={data.tipoUso}
                padraoConstrutivo={data.padraoConstrutivo}
                scatterData={data.scatterData}
              />
            )}
            {activePage === 'explorer' && (
              <PageExplorer treemapData={data.treemapData} />
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </Layout>
  )
}

export default function App() {
  return (
    <FilterProvider>
      <Dashboard />
    </FilterProvider>
  )
}
