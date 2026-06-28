import { useEffect, useState } from 'react'
import api from '../api/axios'
import { BookOpen, Plus, Search, CheckCircle, Clock, AlertTriangle, FileText, ChevronRight, BarChart3 } from 'lucide-react'

export default function Capitulos() {
  const [capitulos, setCapitulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('todos')

  useEffect(() => { cargarCapitulos() }, [])

  const cargarCapitulos = async () => {
    try {
      const res = await api.get('/capitulos/proyecto/')
      setCapitulos(res.data.results || res.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const capitulosFiltrados = filtroEstado === 'todos' 
    ? capitulos 
    : capitulos.filter(c => c.estado === filtroEstado)

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'aprobado': return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Aprobado</span>
      case 'en_revision': return <span className="badge-warning flex items-center gap-1"><Clock className="w-3 h-3"/> En Revisión</span>
      case 'pendiente': return <span className="badge-gray flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Pendiente</span>
      default: return <span className="badge-gray">{estado}</span>
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: '#1e3a5f', borderTopColor: '#667EEA' }}></div></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Capítulos</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de capítulos de ingeniería por proyecto</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4"/> Nuevo Capítulo
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="kpi-card border-emerald-200">
          <div className="flex items-center justify-between">
            <CheckCircle className="w-8 h-8 text-emerald-600"/>
            <span className="text-2xl font-extrabold text-emerald-700">{capitulos.filter(c => c.estado === 'aprobado').length}</span>
          </div>
          <p className="text-sm text-emerald-600 font-medium mt-2">Aprobados</p>
        </div>
        <div className="kpi-card border-amber-200">
          <div className="flex items-center justify-between">
            <Clock className="w-8 h-8 text-amber-600"/>
            <span className="text-2xl font-extrabold text-amber-700">{capitulos.filter(c => c.estado === 'en_revision').length}</span>
          </div>
          <p className="text-sm text-amber-600 font-medium mt-2">En Revisión</p>
        </div>
        <div className="kpi-card border-slate-200">
          <div className="flex items-center justify-between">
            <AlertTriangle className="w-8 h-8 text-slate-500"/>
            <span className="text-2xl font-extrabold text-slate-700">{capitulos.filter(c => c.estado === 'pendiente').length}</span>
          </div>
          <p className="text-sm text-slate-600 font-medium mt-2">Pendientes</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['todos', 'aprobado', 'en_revision', 'pendiente'].map(estado => (
          <button 
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filtroEstado === estado ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'}`}
          >
            {estado === 'todos' ? 'Todos' : estado === 'en_revision' ? 'En Revisión' : estado.charAt(0).toUpperCase() + estado.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {capitulosFiltrados.map(c => (
          <div key={c.id} className="card hover:shadow-md transition-shadow">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold text-sm">
                  {c.capitulo_maestro?.codigo || 'N/A'}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{c.capitulo_maestro?.nombre || 'Capítulo sin nombre'}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> {c.proyecto?.codigo}</span>
                    <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3"/> {c.documentos_count || 0} docs</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getEstadoBadge(c.estado)}
                <div className="w-24">
                  <div className="progress-bar">
                    <div className={`h-full rounded-full ${c.estado === 'aprobado' ? 'bg-emerald-500' : c.estado === 'en_revision' ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                         style={{width: c.estado === 'aprobado' ? '100%' : c.estado === 'en_revision' ? '60%' : '20%'}}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 text-center">
                    {c.estado === 'aprobado' ? '100%' : c.estado === 'en_revision' ? '60%' : '20%'}
                  </p>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-5 h-5"/>
                </button>
              </div>
            </div>
          </div>
        ))}
        {capitulosFiltrados.length === 0 && (
          <div className="card p-12 text-center text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300"/>
            <p>No hay capítulos en este estado</p>
          </div>
        )}
      </div>
    </div>
  )
}
