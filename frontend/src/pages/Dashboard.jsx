import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Folder, FileText, CheckCircle, Clock, AlertTriangle, TrendingUp, Users, Calendar, ArrowRight } from 'lucide-react'
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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general del sistema AQUA-8</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Folder />, label: 'Proyectos', value: stats.proyectos, color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
          { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, label: 'Capítulos', value: stats.capitulos, color: 'bg-purple-50 text-purple-700', border: 'border-purple-200' },
          { icon: <FileText />, label: 'Documentos', value: stats.documentos, color: 'bg-orange-50 text-orange-700', border: 'border-orange-200' },
          { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>, label: 'Memorias', value: stats.memorias, color: 'bg-cyan-50 text-cyan-700', border: 'border-cyan-200' },
        ].map((card, i) => (
          <div key={i} className={`bg-white rounded-xl border ${card.border} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.color}`}>{card.icon}</div>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Estado de Capítulos</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">{stats.aprobados}</p>
            <p className="text-sm text-green-600">Aprobados</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-700">{stats.en_revision}</p>
            <p className="text-sm text-yellow-600">En Revisión</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <Clock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-700">{stats.pendientes}</p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Proyectos Recientes</h2>
            <Link to="/proyectos" className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1">Ver todos <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-100">
            {proyectosRecientes.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg"><Folder className="w-4 h-4 text-cyan-600" /></div>
                  <div><p className="font-medium text-sm text-gray-900">{p.codigo}</p><p className="text-xs text-gray-500">{p.nombre}</p></div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${p.estado === 'aprobado' ? 'bg-green-100 text-green-700' : p.estado === 'ejecucion' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{p.estado.replace('_', ' ')}</span>
              </div>
            ))}
            {proyectosRecientes.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">No hay proyectos registrados</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Capítulos Requieren Atención</h2>
            <Link to="/capitulos" className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1">Ver todos <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-100">
            {capitulosPendientes.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold text-xs">{c.capitulo_maestro?.codigo}</div>
                  <div><p className="font-medium text-sm text-gray-900">{c.capitulo_maestro?.nombre}</p><p className="text-xs text-gray-500">{c.proyecto?.codigo || 'Proyecto'}</p></div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${c.estado === 'en_revision' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{c.estado.replace('_', ' ')}</span>
              </div>
            ))}
            {capitulosPendientes.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">¡Todo está al día!</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
