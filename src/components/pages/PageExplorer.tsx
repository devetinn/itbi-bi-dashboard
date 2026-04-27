import { motion, type Variants } from 'framer-motion'
import { BairrosMap } from '../map/BairrosMap'
import { useFilterContext } from '../../context/FilterContext'
import type { BairroStat } from '../map/BairrosMap'

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

interface Props {
  bairroStats: Record<string, BairroStat>
}

export function PageExplorer({ bairroStats }: Props) {
  const { filters, toggleBairro } = useFilterContext()

  // Build ranking from bairroStats
  const ranking = Object.entries(bairroStats)
    .sort((a, b) => b[1].qtd - a[1].qtd)
    .slice(0, 20)

  const maxQtd = ranking[0]?.[1].qtd ?? 1

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      {/* Map panel */}
      <motion.div variants={item}>
        <div
          className="rounded-[14px] overflow-hidden border"
          style={{ background: '#FFFFFF', borderColor: '#E7E4DC' }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#E7E4DC' }}>
            <div>
              <h3
                className="font-bold text-[16px]"
                style={{ fontFamily: 'var(--f-display)', color: '#1A1A1A', letterSpacing: '-0.005em' }}
              >
                Mapa de Fortaleza
              </h3>
              <p className="text-[12.5px] mt-0.5" style={{ color: '#6E6E6B' }}>
                Clique em um bairro para filtrar · Selecione a métrica acima
              </p>
            </div>
            {filters.bairros.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => filters.bairros.forEach((b) => toggleBairro(b))}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-colors"
                style={{
                  fontFamily: 'var(--f-display)',
                  color: '#C04617',
                  borderColor: '#F15A22',
                  background: '#FEEFE7',
                }}
              >
                Limpar bairros ({filters.bairros.length})
              </motion.button>
            )}
          </div>

          <div className="p-4">
            <BairrosMap
              bairroStats={bairroStats}
              onBairroClick={toggleBairro}
              selectedBairros={filters.bairros}
            />
          </div>
        </div>
      </motion.div>

      {/* Ranking table */}
      <motion.div variants={item}>
        <div
          className="rounded-[14px] border overflow-hidden"
          style={{ background: '#FFFFFF', borderColor: '#E7E4DC' }}
        >
          <div className="px-5 py-3 border-b" style={{ borderColor: '#E7E4DC' }}>
            <h3
              className="font-bold text-[16px]"
              style={{ fontFamily: 'var(--f-display)', color: '#1A1A1A', letterSpacing: '-0.005em' }}
            >
              Ranking por Bairro
            </h3>
            <p className="text-[12.5px] mt-0.5" style={{ color: '#6E6E6B' }}>
              Top 20 por volume de transações
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E7E4DC' }}>
                  {['#', 'Bairro', 'Transações', 'VGV (R$ mi)', 'Ticket Médio', 'R$/m²'].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ fontFamily: 'var(--f-display)', color: '#9A9A95' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ranking.map(([bairro, stat], i) => {
                  const selected = filters.bairros.includes(bairro)
                  return (
                    <motion.tr
                      key={bairro}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => toggleBairro(bairro)}
                      className="cursor-pointer transition-colors"
                      style={{
                        borderBottom: '1px solid #F5F3EE',
                        background: selected ? '#FEEFE7' : 'transparent',
                      }}
                      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = '#FAFAF7' }}
                      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent' }}
                    >
                      <td className="py-2.5 px-4">
                        <span
                          className="text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded"
                          style={{
                            fontFamily: 'var(--f-mono)',
                            color: i < 3 ? '#F15A22' : '#9A9A95',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div
                              className="text-[12.5px] font-semibold"
                              style={{
                                fontFamily: 'var(--f-display)',
                                color: selected ? '#C04617' : '#1A1A1A',
                              }}
                            >
                              {bairro}
                            </div>
                            {/* Progress bar */}
                            <div className="mt-0.5 h-1 rounded-full" style={{ background: '#E7E4DC', width: 80 }}>
                              <motion.div
                                className="h-1 rounded-full"
                                style={{ background: selected ? '#F15A22' : '#325565' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(stat.qtd / maxQtd) * 100}%` }}
                                transition={{ duration: 0.6, delay: i * 0.02 }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-[12px] font-semibold tabular-nums" style={{ fontFamily: 'var(--f-mono)', color: '#1A1A1A' }}>
                        {stat.qtd.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-2.5 px-4 text-[12px] tabular-nums" style={{ fontFamily: 'var(--f-mono)', color: '#414042' }}>
                        {stat.vl_total_mi.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-4 text-[12px] tabular-nums" style={{ fontFamily: 'var(--f-mono)', color: '#414042' }}>
                        R${stat.ticket_k.toFixed(0)}k
                      </td>
                      <td className="py-2.5 px-4 text-[12px] tabular-nums" style={{ fontFamily: 'var(--f-mono)', color: stat.vl_m2 > 200 ? '#009889' : '#414042' }}>
                        {stat.vl_m2 > 0 ? `R$${stat.vl_m2.toFixed(0)}` : '—'}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
