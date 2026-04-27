import { useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { FilterPanel } from '../filters/FilterPanel'

interface LayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  rawTotal: number
  children: ReactNode
}

export function Layout({ activePage, onNavigate, rawTotal, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          activePage={activePage}
          totalRegistros={rawTotal}
          onMenuToggle={() => setMobileOpen(true)}
          onFilterToggle={() => setFilterOpen((prev) => !prev)}
          filterOpen={filterOpen}
        />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--c-bg)' }}>
          {children}
        </main>
      </div>
      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  )
}
