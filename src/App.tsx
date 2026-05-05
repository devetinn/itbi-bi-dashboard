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
import { MethodologyBanner } from './components/MethodologyBanner'
import { IntroAnimation } from './components/IntroAnimation'

const pageVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 24 : -24,
    scale: 0.98,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -24 : 24,
    scale: 0.98,
    transition: { duration: 0.18, ease: 'easeIn' as const },
  }),
}

const PAGE_ORDER = ['temporal', 'espacial', 'mercado', 'explorer']

function Dashboard() {
  const [activePage, setActivePage] = useState('temporal')
  const [direction, setDirection] = useState(1)
  const data = useITBIData()

  const navigate = (page: string) => {
    const curr = PAGE_ORDER.indexOf(activePage)
    const next = PAGE_ORDER.indexOf(page)
    setDirection(next >= curr ? 1 : -1)
    setActivePage(page)
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={navigate}
      rawTotal={data.loading ? 0 : data.kpis.totalTransacoes}
    >
      <MethodologyBanner />
      <AnimatePresence mode="wait" custom={direction}>
        {data.loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SkeletonLoader />
          </motion.div>
        ) : (
          <motion.div
            key={activePage}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-full"
          >
            {activePage === 'temporal' && (
              <PageTemporal
                kpis={data.kpis}
                transacoesPorMes={data.transacoesPorMes}
                faixaValor={data.faixaValor}
                heatmapData={data.heatmapData}
                anoStats={data.anoStats}
              />
            )}
            {activePage === 'espacial' && (
              <PageEspacial
                kpis={data.kpis}
                rankingBairros={data.rankingBairros}
                valorM2Bairros={data.valorM2Bairros}
                paretoData={data.paretoData}
              />
            )}
            {activePage === 'mercado' && (
              <PageMercado
                kpis={data.kpis}
                tipoUso={data.tipoUso}
                padraoConstrutivo={data.padraoConstrutivo}
                scatterData={data.scatterData}
                zoneamentoData={data.zoneamentoData}
                correlacaoBairros={data.correlacaoBairros}
                validationParams={data.validationParams}
              />
            )}
            {activePage === 'explorer' && (
              <PageExplorer bairroStats={data.bairroStats} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)

  if (!introComplete) {
    return <IntroAnimation onComplete={() => setIntroComplete(true)} />
  }

  return (
    <FilterProvider>
      <Dashboard />
    </FilterProvider>
  )
}
