import { useEffect, useState } from 'react'
import api from '../api/axios'
import { FolderPlus, Search, Filter, ArrowUpDown, MoreHorizontal, Calendar, MapPin, Users, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Proyectos() {
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')

  useEffect(() => { cargarProyectos() }, [])

  const cargarProyectos = async () => {
    try {
      const res = await api.get('/proyectos/')
      setProyectos(res.data.results || res.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const proyectosFiltrados = proyectos.filter(p => 
    p.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.codigo?.toLowerCase().includes(filtro.toLowerCase())
  )

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'aprobado': return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Aprobado</span>
      case 'ejecucion': return <span className="badge-info flex items-center gap-1"><Clock className="w-3 h-3"/> En Ejecución</span>
      case 'pendiente': return <span className="badge-warning flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Pendiente</span>
      default: return <span className="badge-gray">{estado}</span>
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Proyectos</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de proyectos técnicos y de ingeniería</p>
        </div>
        <button className="btn-primary">
          <FolderPlus className="w-4 h-4"/> Nuevo Proyecto
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input 
              type="text" 
              placeholder="Buscar por código o nombre..." 
              className="form-input pl-10"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <button className="btn-outline"><Filter className="w-4 h-4"/> Filtrar</button>
          <button className="btn-outline"><ArrowUpDown className="w-4 h-4"/> Ordenar</button>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Proyecto</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Capítulos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectosFiltrados.map(p => (
                <tr key={p.id}>
                  <td>
                    <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{p.codigo}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FolderPlus className="w-5 h-5 text-blue-600"/>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{p.nombre}</p>
                        <p className="text-xs text-slate-500">{p.descripcion?.substring(0, 60)}...</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400"/>
                      {p.ubicacion || 'No especificada'}
                    </div>
                  </td>
                  <td>{getEstadoBadge(p.estado)}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400"/>
                      <span className="text-sm font-medium text-slate-700">{p.capitulos_count || 0} capítulos</span>
                    </div>
                  </td>
                  <td>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))}
              {proyectosFiltrados.length === 0 && (
                <tr><td colSpan="6" className="text-center py-12 text-slate-500">No se encontraron proyectos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
