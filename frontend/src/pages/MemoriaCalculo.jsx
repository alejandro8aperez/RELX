import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Calculator, Plus, Search, Download, Eye, FileText, CheckCircle, Clock, AlertTriangle, BarChart3, TrendingUp } from 'lucide-react'

export default function MemoriaCalculo() {
  const [memorias, setMemorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { cargarMemorias() }, [])

  const cargarMemorias = async () => {
    try {
      const res = await api.get('/memoria/')
      setMemorias(res.data.results || res.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'aprobado': return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Aprobada</span>
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
          <h1 className="text-2xl font-bold text-slate-800">Memoria de Cálculo</h1>
          <p className="text-sm text-slate-500 mt-1">Cálculos técnicos y validaciones de ingeniería</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4"/> Nueva Memoria
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Memorias', value: memorias.length, icon: Calculator, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Aprobadas', value: memorias.filter(m => m.estado === 'aprobado').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'En Revisión', value: memorias.filter(m => m.estado === 'en_revision').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Pendientes', value: memorias.filter(m => m.estado === 'pendiente').length, icon: AlertTriangle, color: 'text-slate-600', bg: 'bg-slate-100' },
        ].map((stat, i) => (
          <div key={i} className="kpi-card">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5"/>
              </div>
              <span className="text-2xl font-extrabold text-slate-800">{stat.value}</span>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="font-bold text-slate-800">Memorias de Cálculo</h2>
          <div className="flex gap-2">
            <button className="btn-outline text-xs"><Search className="w-3 h-3"/> Buscar</button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {memorias.map(mem => (
            <div key={mem.id} className="p-5 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-50 rounded-xl group-hover:bg-cyan-100 transition-colors">
                    <Calculator className="w-6 h-6 text-cyan-600"/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-800">{mem.titulo || 'Memoria sin título'}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> {mem.proyecto?.codigo || 'Sin proyecto'}</span>
                      <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3"/> {mem.tipo_calculo || 'General'}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3"/> {mem.resultado || 'Sin resultado'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getEstadoBadge(mem.estado)}
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                      <Eye className="w-4 h-4"/>
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors">
                      <Download className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>
              {mem.descripcion && (
                <p className="mt-3 text-xs text-slate-500 pl-[60px]">{mem.descripcion}</p>
              )}
            </div>
          ))}
          {memorias.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <Calculator className="w-12 h-12 mx-auto mb-3 text-slate-300"/>
              <p>No hay memorias de cálculo registradas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
