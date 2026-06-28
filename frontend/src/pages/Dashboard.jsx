import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Folder, FileText, CheckCircle, Clock, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({ proyectos: 0, capitulos: 0, documentos: 0, aprobados: 0, en_revision: 0, pendientes: 0, memorias: 0 })
  const [proyectosRecientes, setProyectosRecientes] = useState([])
  const [capitulosPendientes, setCapitulosPendientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    try {
      const [proyRes, capRes, docRes, memRes] = await Promise.all([
        api.get('/proyectos/'), api.get('/capitulos/proyecto/'),
        api.get('/documentos/'), api.get('/memoria/')
      ])
      const proyectos = proyRes.data.results || proyRes.data
      const capitulos = capRes.data.results || capRes.data
      const documentos = docRes.data.results || docRes.data
      const memorias = memRes.data.results || memRes.data
      setStats({
        proyectos: proyectos.length, capitulos: capitulos.length,
        documentos: documentos.length, memorias: memorias.length,
        aprobados: capitulos.filter(c => c.estado === 'aprobado').length,
        en_revision: capitulos.filter(c => c.estado === 'en_revision').length,
        pendientes: capitulos.filter(c => c.estado === 'pendiente').length,
      })
      setProyectosRecientes(proyectos.slice(0, 5))
      setCapitulosPendientes(capitulos.filter(c => c.estado === 'pendiente' || c.estado === 'en_revision').slice(0, 5))
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: '#1e3a5f', borderTopColor: '#667EEA' }}></div></div>

  const kpiCards = [
    { icon: Folder, label: 'Proyectos', value: stats.proyectos, color: '#667EEA', bg: '#EEF2FF', border: '#C7D2FE' },
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, label: 'Capítulos', value: stats.capitulos, color: '#764BA2', bg: '#F5F3FF', border: '#DDD6FE' },
    { icon: FileText, label: 'Documentos', value: stats.documentos, color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>, label: 'Memorias', value: stats.memorias, color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="kpi-card" style={{ borderColor: card.border }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: card.bg, color: card.color }}><Icon className="w-6 h-6" /></div>
                <TrendingUp className="w-5 h-5" style={{ color: '#94a3b8' }} />
              </div>
              <p className="text-3xl font-extrabold tracking-tight" style={{ color: '#1a202c' }}>{card.value}</p>
              <p className="text-sm font-medium mt-1" style={{ color: '#718096' }}>{card.label}</p>
            </div>
          )
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="font-bold">Estado de Capítulos</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-5 rounded-xl border" style={{ backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }}>
              <CheckCircle className="w-7 h-7 mx-auto mb-2" style={{ color: '#10B981' }} />
              <p className="text-3xl font-extrabold" style={{ color: '#047857' }}>{stats.aprobados}</p>
              <p className="text-sm font-medium" style={{ color: '#059669' }}>Aprobados</p>
            </div>
            <div className="text-center p-5 rounded-xl border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
              <AlertTriangle className="w-7 h-7 mx-auto mb-2" style={{ color: '#F59E0B' }} />
              <p className="text-3xl font-extrabold" style={{ color: '#B45309' }}>{stats.en_revision}</p>
              <p className="text-sm font-medium" style={{ color: '#D97706' }}>En Revisión</p>
            </div>
            <div className="text-center p-5 rounded-xl border" style={{ backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }}>
              <Clock className="w-7 h-7 mx-auto mb-2" style={{ color: '#64748B' }} />
              <p className="text-3xl font-extrabold" style={{ color: '#475569' }}>{stats.pendientes}</p>
              <p className="text-sm font-medium" style={{ color: '#64748B' }}>Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="font-bold">Proyectos Recientes</h2>
            <Link to="/proyectos" className="text-sm font-medium flex items-center gap-1" style={{ color: '#667EEA' }}>Ver todos <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="divide-y divide-slate-100">
            {proyectosRecientes.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#EEF2FF' }}><Folder className="w-5 h-5" style={{ color: '#667EEA' }} /></div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1a202c' }}>{p.codigo}</p>
                    <p className="text-xs" style={{ color: '#718096' }}>{p.nombre}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${p.estado === 'aprobado' ? 'badge-success' : p.estado === 'ejecucion' ? 'badge-info' : 'badge-gray'}`}>{p.estado.replace('_', ' ')}</span>
              </div>
            ))}
            {proyectosRecientes.length === 0 && <div className="p-8 text-center text-sm" style={{ color: '#718096' }}>No hay proyectos registrados</div>}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="font-bold">Capítulos Requieren Atención</h2>
            <Link to="/capitulos" className="text-sm font-medium flex items-center gap-1" style={{ color: '#667EEA' }}>Ver todos <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="divide-y divide-slate-100">
            {capitulosPendientes.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: '#F5F3FF', color: '#764BA2' }}>{c.capitulo_maestro?.codigo}</div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: '#1a202c' }}>{c.capitulo_maestro?.nombre}</p>
                    <p className="text-xs" style={{ color: '#718096' }}>{c.proyecto?.codigo || 'Proyecto'}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize flex items-center gap-1 ${c.estado === 'en_revision' ? 'badge-warning' : 'badge-gray'}`}>
                  {c.estado === 'en_revision' ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{c.estado.replace('_', ' ')}
                </span>
              </div>
            ))}
            {capitulosPendientes.length === 0 && <div className="p-8 text-center text-sm" style={{ color: '#718096' }}>¡Todo está al día!</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
