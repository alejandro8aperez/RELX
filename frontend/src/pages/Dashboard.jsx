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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>

  const kpiCards = [
    { icon: Folder, label: 'Proyectos', value: stats.proyectos, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, label: 'Capítulos', value: stats.capitulos, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    { icon: FileText, label: 'Documentos', value: stats.documentos, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>, label: 'Memorias', value: stats.memorias, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  ]

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className={`kpi-card border ${card.border}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}><Icon className="w-6 h-6" /></div>
                <TrendingUp className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{card.value}</p>
              <p className="text-sm text-slate-500 font-medium mt-1">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Estado de Capítulos */}
      <div className="card">
        <div className="card-header">
          <h2 className="font-bold text-slate-800">Estado de Capítulos</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-5 bg-emerald-50 rounded-xl border border-emerald-100">
              <CheckCircle className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
              <p className="text-3xl font-extrabold text-emerald-700">{stats.aprobados}</p>
              <p className="text-sm text-emerald-600 font-medium">Aprobados</p>
            </div>
            <div className="text-center p-5 bg-amber-50 rounded-xl border border-amber-100">
              <AlertTriangle className="w-7 h-7 text-amber-600 mx-auto mb-2" />
              <p className="text-3xl font-extrabold text-amber-700">{stats.en_revision}</p>
              <p className="text-sm text-amber-600 font-medium">En Revisión</p>
            </div>
            <div className="text-center p-5 bg-slate-100 rounded-xl border border-slate-200">
              <Clock className="w-7 h-7 text-slate-600 mx-auto mb-2" />
              <p className="text-3xl font-extrabold text-slate-700">{stats.pendientes}</p>
              <p className="text-sm text-slate-600 font-medium">Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proyectos Recientes */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-bold text-slate-800">Proyectos Recientes</h2>
            <Link to="/proyectos" className="text-sm text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {proyectosRecientes.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg"><Folder className="w-5 h-5 text-blue-600" /></div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{p.codigo}</p>
                    <p className="text-xs text-slate-500">{p.nombre}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${p.estado === 'aprobado' ? 'badge-success' : p.estado === 'ejecucion' ? 'badge-info' : 'badge-gray'}`}>
                  {p.estado.replace('_', ' ')}
                </span>
              </div>
            ))}
            {proyectosRecientes.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">No hay proyectos registrados</div>}
          </div>
        </div>

        {/* Capítulos que Requieren Atención */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-bold text-slate-800">Capítulos Requieren Atención</h2>
            <Link to="/capitulos" className="text-sm text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {capitulosPendientes.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold text-xs">
                    {c.capitulo_maestro?.codigo}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-800">{c.capitulo_maestro?.nombre}</p>
                    <p className="text-xs text-slate-500">{c.proyecto?.codigo || 'Proyecto'}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize flex items-center gap-1 ${c.estado === 'en_revision' ? 'badge-warning' : 'badge-gray'}`}>
                  {c.estado === 'en_revision' ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {c.estado.replace('_', ' ')}
                </span>
              </div>
            ))}
            {capitulosPendientes.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">¡Todo está al día!</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
