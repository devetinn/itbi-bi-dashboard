import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DATA_GROUND_TRUTH } from '../utils/dataValidation'

const STORAGE_KEY = 'itbi-banner-dismissed'

export function MethodologyBanner() {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1'
    } catch {
      return true
    }
  })

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* noop */ }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div
            className="flex items-center gap-3 px-4 py-2.5 text-xs"
            style={{
              background: 'linear-gradient(135deg, #1F3845 0%, #2D6A5F 100%)',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 flex-1 min-w-0">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span>🐍</span>
                <span>
                  ETL em <strong style={{ color: 'white' }}>Python puro</strong> — sem Power Query
                </span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5 whitespace-nowrap">
                <span>📊</span>
                <span>
                  <strong style={{ color: 'white' }}>{DATA_GROUND_TRUTH.totalRegistros.toLocaleString('pt-BR')}</strong> registros · {DATA_GROUND_TRUTH.anosCobertura}
                </span>
              </span>
              <span className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
                <span>🗺️</span>
                <span>
                  <strong style={{ color: 'white' }}>{DATA_GROUND_TRUTH.bairrosUnicos}</strong> bairros de Fortaleza
                </span>
              </span>
              <span className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
                <span>🏛️</span>
                <span>Fonte: SEFIN Fortaleza</span>
              </span>
            </div>
            <button
              onClick={dismiss}
              className="flex-shrink-0 text-xs px-2.5 py-1 rounded-md font-medium transition-all"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                fontFamily: 'var(--f-display)',
              }}
            >
              Entendido
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
