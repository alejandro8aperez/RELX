import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, Bell, User, LogOut, Droplets, LayoutDashboard, FolderKanban, BookOpen, FileText, Calculator } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/proyectos', label: 'Proyectos', icon: FolderKanban },
    { path: '/capitulos', label: 'Capítulos', icon: BookOpen },
    { path: '/documentos', label: 'Documentos', icon: FileText },
    { path: '/memoria', label: 'Memoria Cálculo', icon: Calculator },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0f172a' }}>
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`} style={{ background: 'linear-gradient(180deg, #0a1628 0%, #1e293b 100%)', borderRight: '1px solid #1e3a5f' }}>
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid #1e3a5f' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)', boxShadow: '0 2px 8px rgba(102,126,234,0.3)' }}>
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">AQUA-8</h1>
            <p className="text-xs font-medium" style={{ color: '#667EEA' }}>Capítulos de Ingeniería</p>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>Principal</div>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200`}
                style={active ? { background: 'rgba(79, 70, 229, 0.32)', color: '#ffffff', borderLeft: '3px solid #818cf8' } : { color: '#94a3b8' }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(79, 70, 229, 0.18)'; e.currentTarget.style.color = '#ffffff' } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' } }}>
                <Icon className={`w-5 h-5`} style={active ? { color: '#818cf8' } : { color: '#64748b' }} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid #1e3a5f' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)' }}>
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.username || 'Usuario'}</p>
              <p className="text-xs truncate" style={{ color: '#64748b' }}>{user?.email || ''}</p>
            </div>
            <LogOut className="w-5 h-5 cursor-pointer transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'} />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-3 flex items-center justify-between sticky top-0 z-40" style={{ background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e3a5f' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg" style={{ color: '#94a3b8' }}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h2 className="text-lg font-bold text-white">{navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}</h2>
              <p className="text-xs" style={{ color: '#64748b' }}>AQUA-8 / <span style={{ color: '#667EEA', fontWeight: 600 }}>{navItems.find(n => n.path === location.pathname)?.label || 'Panel Principal'}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg" style={{ color: '#94a3b8', border: '1px solid #1e3a5f' }}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2" style={{ borderColor: '#0a1628' }}></span>
            </button>
            <button className="p-2 rounded-lg" style={{ color: '#94a3b8', border: '1px solid #1e3a5f' }}>
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 lg:p-8" style={{ backgroundColor: '#f5f7fa' }}>{children}</main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-40 lg:hidden" style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', backdropFilter: 'blur(2px)' }} onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
