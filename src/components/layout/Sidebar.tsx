interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
  totalRegistros: string
  mobileOpen: boolean
  onMobileClose: () => void
}

const navItems = [
  { id: 'temporal', label: 'Temporal', icon: '📈' },
  { id: 'espacial', label: 'Espacial', icon: '🗺️' },
  { id: 'mercado', label: 'Mercado', icon: '🏘️' },
  { id: 'explorer', label: 'Explorer', icon: '🔍' },
]

export function Sidebar({ activePage, onNavigate, totalRegistros, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={`fixed md:relative z-30 md:z-auto inset-y-0 left-0 w-[220px] flex-shrink-0 bg-[#2A2A2A] flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-4 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4A7C6F, #2D6A5F)' }}
            >
              I
            </div>
            <div>
              <div className="text-white font-semibold text-base leading-tight">ITBI</div>
              <div className="text-[#8A8A8A] text-xs">Fortaleza</div>
            </div>
          </div>
          <div className="h-px bg-[#3A3A3A] mt-4" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2">
          <div className="text-[10px] uppercase tracking-widest text-[#555] mb-2 px-3">Análise</div>
          {navItems.map((item) => {
            const active = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onMobileClose() }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-all duration-150 text-left ${
                  active
                    ? 'bg-[#4A7C6F] text-white'
                    : 'text-[#8A8A8A] hover:bg-[#333] hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-5">
          <div className="h-px bg-[#3A3A3A] mb-3" />
          <div className="flex items-center gap-1.5 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs text-[#8A8A8A]">Ao vivo</span>
          </div>
          <div className="text-xs text-[#555]">{totalRegistros} registros</div>
          <div className="text-xs text-[#555]">Fonte: SEFIN · Fortaleza</div>
        </div>
      </aside>
    </>
  )
}
