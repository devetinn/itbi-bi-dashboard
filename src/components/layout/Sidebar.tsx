import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
import { DataSourceBadge } from '../DataSourceBadge'

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

interface NavItem { id: string; label: string; icon: ReactNode }

const navItems: NavItem[] = [
  {
    id: 'temporal',
    label: 'Temporal',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <polyline points="1,12 5,7 8,9 12,4 15,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="1" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'espacial',
    label: 'Espacial',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    id: 'mercado',
    label: 'Mercado',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="5" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 14V10h6v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M2 5l6-3.5L14 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'explorer',
    label: 'Explorer',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.1 + i * 0.06, duration: 0.3, ease: 'easeOut' as const },
  }),
}

export function Sidebar({
  activePage, onNavigate, mobileOpen, onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        className={`fixed md:relative z-30 md:z-auto inset-y-0 left-0 w-[220px] flex-shrink-0 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ background: '#1F3845' }}
      >
        {/* Logo area */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="px-4 pt-5 pb-3"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 flex-shrink-0 bg-white rounded-md flex items-center justify-center overflow-hidden"
              style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
            >
              <img 
                src="/logo.png" 
                alt="Logo Prefeitura" 
                className="w-full h-full object-contain p-1"
                onError={(e) => { e.currentTarget.src = '/logo_pmf.svg' }}
              />
            </motion.div>
            <div>
              <div
                className="text-white font-bold text-base leading-tight"
                style={{ fontFamily: 'var(--f-display)', letterSpacing: '-0.01em' }}
              >
                ITBI
              </div>
              <div
                className="text-[11px] tracking-wide"
                style={{ color: 'rgba(255,255,255,0.38)' }}
              >
                Fortaleza
              </div>
            </div>
          </div>
          <div className="h-px mt-4" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[9px] uppercase mb-2 px-3 font-semibold"
            style={{
              fontFamily: 'var(--f-display)',
              letterSpacing: '.15em',
              color: 'rgba(255,255,255,0.28)',
            }}
          >
            Análise
          </motion.div>

          {navItems.map((item, i) => {
            const active = activePage === item.id
            return (
              <motion.div
                key={item.id}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="show"
                className="relative mb-0.5"
              >
                {/* Animated active background */}
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(241,90,34,0.18)' }}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={() => { onNavigate(item.id); onMobileClose() }}
                  whileTap={{ scale: 0.97 }}
                  className="relative z-10 w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors duration-150"
                  style={{
                    fontFamily: 'var(--f-body)',
                    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.48)',
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.78)'
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.48)'
                  }}
                >
                  <motion.span
                    animate={active ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    {item.icon}
                  </motion.span>
                  <span className="tracking-tight">{item.label}</span>

                  {/* Active indicator */}
                  {active && (
                    <motion.span
                      layoutId="nav-dot"
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: '#F15A22' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    />
                  )}
                </motion.button>
              </motion.div>
            )
          })}

          <div className="mt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[9px] uppercase mb-2 px-3 font-semibold"
              style={{
                fontFamily: 'var(--f-display)',
                letterSpacing: '.15em',
                color: 'rgba(255,255,255,0.28)',
              }}
            >
              Documentação
            </motion.div>
            <motion.a
              href="/doc-tecnica.html"
              className="relative z-10 w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors duration-150"
              style={{ fontFamily: 'var(--f-body)', color: 'rgba(255,255,255,0.48)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.78)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.48)'}
            >
              <motion.span className="flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2.5C4 1.67157 4.67157 1 5.5 1H9.5C9.76522 1 10.0196 1.10536 10.2071 1.29289L13.7071 4.79289C13.8946 4.98043 14 5.23478 14 5.5V13.5C14 14.3284 13.3284 15 12.5 15H5.5C4.67157 15 4 14.3284 4 13.5V2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 1V5H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 8H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.span>
              <span className="tracking-tight">Doc. Técnica</span>
            </motion.a>
            
            <motion.a
              href="/doc-negocios.html"
              className="relative z-10 w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors duration-150"
              style={{ fontFamily: 'var(--f-body)', color: 'rgba(255,255,255,0.48)', textDecoration: 'none', marginTop: '2px' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.78)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.48)'}
            >
              <motion.span className="flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="3" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="13" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="8" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M4.5 5L6.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M11.5 5L9.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M8 12.5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </motion.span>
              <span className="tracking-tight">Mapa Mental</span>
            </motion.a>
          </div>
        </nav>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="px-4 pb-5"
        >
          <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.07)' }} />

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#009889' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#009889' }} />
            </span>
            <span
              className="text-[11px] font-medium"
              style={{ fontFamily: 'var(--f-body)', color: 'rgba(255,255,255,0.42)' }}
            >
              Ao vivo
            </span>
          </div>

          <DataSourceBadge />
        </motion.div>
      </motion.aside>
    </>
  )
}
