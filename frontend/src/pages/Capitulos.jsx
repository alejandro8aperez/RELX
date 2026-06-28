import { useState, useEffect } from 'react'
import api from '../api/axios'
import { BookOpen, ChevronRight, CheckCircle, Clock, AlertTriangle, ArrowRight, ArrowLeft, FileText, Calculator, Eye } from 'lucide-react'

export default function Capitulos() {
  const [proyectos, setProyectos] = useState([])
  const [proyectoSel, setProyectoSel] = useState(null)
  const [capitulos, setCapitulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [detalleCap, setDetalleCap] = useState(null)

  useEffect(() => { cargarProyectos() }, [])
  useEffect(() => { if (proyectoSel) cargarCapitulos() }, [proyectoSel])

  const cargarProyectos = async () => {
    const res = await api.get('/proyectos/')
    setProyectos(res.data.results || res.data)
    setLoading(false)
  }
  const cargarCapitulos = async () => {
    const res = await api.get(`/capitulos/proyecto/?proyecto=${proyectoSel}`)
    setCapitulos(res.data.results || res.data)
  }
  const avanzarEstado = async (id) => {
    await api.post(`/capitulos/proyecto/${id}/avanzar_estado/`)
    cargarCapitulos()
  }

  const estados = {
    pendiente: { color: 'bg-gray-100 text-gray-600', icon: Clock, bar: 'bg-gray-300' },
    en_desarrollo: { color: 'bg-blue-100 text-blue-700', icon: FileText, bar: 'bg-blue-500' },
    en_revision: { color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle, bar: 'bg-yellow-500' },
    aprobado: { color: 'bg-green-100 text-green-700', icon: CheckCircle, bar: 'bg-green-500' },
    rechazado: { color: 'bg-red-100 text-red-700', icon: AlertTriangle, bar: 'bg-red-500' },
  }
  const disciplinas = {
    general: 'bg-slate-100 text-slate-700', civil: 'bg-orange-100 text-orange-700',
    hidraulica: 'bg-blue-100 text-blue-700', electrica: 'bg-yellow-100 text-yellow-700',
    mecanica: 'bg-gray-100 text-gray-700', ambiental: 'bg-green-100 text-green-700',
    geotecnia: 'bg-amber-100 text-amber-700', topografia: 'bg-purple-100 text-purple-700',
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Capítulos de Ingeniería</h1><p className="text-sm text-gray-500 mt-1">Gestión de capítulos por proyecto</p></div>
      {!proyectoSel ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200"><h2 className="font-semibold">Selecciona un proyecto</h2></div>
          <div className="divide-y divide-gray-100">
            {proyectos.map(p => (
              <button key={p.id} onClick={() => setProyectoSel(p.id)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center gap-3"><div className="p-2 bg-cyan-50 rounded-lg"><BookOpen className="w-5 h-5 text-cyan-600" /></div><div><p className="font-medium text-gray-900">{p.codigo} - {p.nombre}</p><p className="text-sm text-gray-500">{p.cliente} • {p.tipo}</p></div></div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button onClick={() => {setProyectoSel(null); setDetalleCap(null)}} className="mb-4 flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700"><ArrowLeft className="w-4 h-4" /> Volver a proyectos</button>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between"><h2 className="font-semibold">Capítulos del Proyecto</h2><span className="text-sm text-gray-500">{capitulos.length} capítulos</span></div>
            <div className="divide-y divide-gray-100">
              {capitulos.map(c => {
                const estado = estados[c.estado] || estados.pendiente
                const Icon = estado.icon
                return (
                  <div key={c.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-sm">{c.capitulo_maestro.codigo}</div>
                        <div>
                          <p className="font-medium text-gray-900">{c.capitulo_maestro.nombre}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${disciplinas[c.capitulo_maestro.disciplina] || disciplinas.general}`}>{c.capitulo_maestro.disciplina}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${estado.color}`}><Icon className="w-3 h-3" /> {c.estado.replace('_', ' ')}</span>
                            <span className="text-xs text-gray-400">v{c.version_actual}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setDetalleCap(c)} className="p-2 hover:bg-gray-100 rounded-lg" title="Ver detalle"><Eye className="w-4 h-4 text-gray-500" /></button>
                        {c.estado !== 'aprobado' && c.estado !== 'rechazado' && (
                          <button onClick={() => avanzarEstado(c.id)} className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 transition-colors">Avanzar <ArrowRight className="w-3 h-3" /></button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full transition-all ${estado.bar}`} style={{width: c.estado === 'aprobado' ? '100%' : c.estado === 'en_revision' ? '75%' : c.estado === 'en_desarrollo' ? '50%' : '25%'}}></div></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {detalleCap && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div><h2 className="text-lg font-bold">Capítulo {detalleCap.capitulo_maestro.codigo}</h2><p className="text-sm text-gray-500">{detalleCap.capitulo_maestro.nombre}</p></div>
              <button onClick={() => setDetalleCap(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-gray-500">Estado</p><p className="font-medium capitalize">{detalleCap.estado.replace('_', ' ')}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-gray-500">Versión Actual</p><p className="font-medium">v{detalleCap.version_actual}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-gray-500">Responsable</p><p className="font-medium">{detalleCap.responsable?.first_name || 'Sin asignar'} {detalleCap.responsable?.last_name || ''}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-gray-500">Disciplina</p><p className="font-medium capitalize">{detalleCap.capitulo_maestro.disciplina}</p></div>
              </div>
              <div><p className="text-sm font-medium text-gray-700 mb-2">Descripción</p><p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{detalleCap.capitulo_maestro.descripcion || 'Sin descripción'}</p></div>
              <div className="flex gap-3 pt-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"><FileText className="w-4 h-4" /> Documentos</button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Calculator className="w-4 h-4" /> Memoria Cálculo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
