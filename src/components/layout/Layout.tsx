import { useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface LayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  totalRegistros: string
  rawTotal: number
  children: ReactNode
}

export function Layout({ activePage, onNavigate, totalRegistros, rawTotal, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        totalRegistros={totalRegistros}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          activePage={activePage}
          totalRegistros={rawTotal}
          onMenuToggle={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-[#F0EFEA]">
          {children}
        </main>
      </div>
    </div>
  )
}
