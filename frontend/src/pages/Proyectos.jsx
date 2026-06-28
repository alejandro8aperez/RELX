import { useState, useEffect } from 'react'
import api from '../api/axios'
import { Folder, Plus, Search, ChevronRight, Calendar, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function Proyectos() {
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [nuevoProyecto, setNuevoProyecto] = useState({ codigo: '', nombre: '', tipo: 'multidisciplinar', descripcion: '', cliente: '', ubicacion: '' })

  useEffect(() => { cargarProyectos() }, [])
  const cargarProyectos = async () => {
    try { const res = await api.get('/proyectos/'); setProyectos(res.data.results || res.data) } catch (e) { console.error(e) }
    setLoading(false)
  }
  const crearProyecto = async (e) => {
    e.preventDefault()
    try { await api.post('/proyectos/', nuevoProyecto); setModalOpen(false); setNuevoProyecto({ codigo: '', nombre: '', tipo: 'multidisciplinar', descripcion: '', cliente: '', ubicacion: '' }); cargarProyectos() } catch (e) { alert('Error al crear proyecto') }
  }

  const estados = {
    borrador: { color: 'bg-gray-100 text-gray-700', icon: Clock },
    en_revision: { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
    aprobado: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
    ejecucion: { color: 'bg-blue-100 text-blue-700', icon: Users },
    finalizado: { color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
  }

  const proyectosFiltrados = proyectos.filter(p => {
    const matchText = (p.nombre + p.codigo + p.cliente).toLowerCase().includes(filtro.toLowerCase())
    const matchEstado = estadoFiltro ? p.estado === estadoFiltro : true
    return matchText && matchEstado
  })

  if (loading) return <div className="p-8 text-center">Cargando proyectos...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Proyectos</h1><p className="text-sm text-gray-500 mt-1">Gestión de proyectos de ingeniería</p></div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" /> Nuevo Proyecto</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por código, nombre o cliente..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="en_revision">En Revisión</option>
          <option value="aprobado">Aprobado</option>
          <option value="ejecucion">En Ejecución</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proyectosFiltrados.map(p => {
          const estado = estados[p.estado] || estados.borrador
          const Icon = estado.icon
          return (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg"><Folder className="w-5 h-5 text-cyan-600" /></div>
                  <div><h3 className="font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">{p.codigo}</h3><p className="text-sm text-gray-500">{p.nombre}</p></div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${estado.color}`}><Icon className="w-3 h-3" /> {p.estado.replace('_', ' ')}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{p.descripcion}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {p.cliente}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.fecha_entrega || 'Sin fecha'}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 capitalize">{p.tipo}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition-colors" />
              </div>
            </div>
          )
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200"><h2 className="text-lg font-bold">Nuevo Proyecto</h2></div>
            <form onSubmit={crearProyecto} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Código</label><input required value={nuevoProyecto.codigo} onChange={e => setNuevoProyecto({...nuevoProyecto, codigo: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label><select value={nuevoProyecto.tipo} onChange={e => setNuevoProyecto({...nuevoProyecto, tipo: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"><option value="civil">Civil</option><option value="mecanica">Mecánica</option><option value="electrica">Eléctrica</option><option value="hidraulica">Hidráulica</option><option value="ambiental">Ambiental</option><option value="multidisciplinar">Multidisciplinar</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label><input required value={nuevoProyecto.nombre} onChange={e => setNuevoProyecto({...nuevoProyecto, nombre: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label><input value={nuevoProyecto.cliente} onChange={e => setNuevoProyecto({...nuevoProyecto, cliente: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label><input value={nuevoProyecto.ubicacion} onChange={e => setNuevoProyecto({...nuevoProyecto, ubicacion: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label><textarea value={nuevoProyecto.descripcion} onChange={e => setNuevoProyecto({...nuevoProyecto, descripcion: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              <div className="flex gap-3 pt-4"><button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button><button type="submit" className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Crear Proyecto</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
