import { useState, useEffect } from 'react'
import api from '../api/axios'
import { Calculator, Search, FileDown, CheckCircle, Clock, AlertTriangle, Edit, Eye, X, Save, Trash2 } from 'lucide-react'

export default function MemoriaCalculo() {
  const [memorias, setMemorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [memoriaEdit, setMemoriaEdit] = useState(null)
  const [secciones, setSecciones] = useState([])
  const [nuevaSeccion, setNuevaSeccion] = useState({ titulo: '', tipo: 'datos', contenido: '' })

  useEffect(() => { cargarMemorias() }, [])
  const cargarMemorias = async () => {
    try { const res = await api.get('/memoria/'); setMemorias(res.data.results || res.data) } catch (e) { console.error(e) }
    setLoading(false)
  }
  const cargarSecciones = async (memoriaId) => {
    try { const res = await api.get(`/memoria/secciones/?memoria=${memoriaId}`); setSecciones(res.data.results || res.data) } catch (e) { setSecciones([]) }
  }
  const abrirEditor = async (memoria) => { setMemoriaEdit(memoria); await cargarSecciones(memoria.id); setEditorOpen(true) }
  const guardarSeccion = async () => {
    if (!nuevaSeccion.titulo) return
    try { await api.post('/memoria/secciones/', { ...nuevaSeccion, memoria: memoriaEdit.id, orden: secciones.length + 1 }); setNuevaSeccion({ titulo: '', tipo: 'datos', contenido: '' }); cargarSecciones(memoriaEdit.id) } catch (e) { alert('Error al guardar sección') }
  }
  const generarPDF = async (memoriaId) => {
    try {
      const res = await api.get(`/memoria/${memoriaId}/generar_pdf/`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `memoria_${memoriaId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (e) { alert('Error al generar PDF') }
  }

  const estados = {
    borrador: { color: 'bg-gray-100 text-gray-600', icon: Clock },
    calculado: { color: 'bg-blue-100 text-blue-700', icon: Calculator },
    verificado: { color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
    aprobado: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  }

  const memoriasFiltradas = memorias.filter(m => {
    const matchText = (m.titulo + m.codigo).toLowerCase().includes(filtro.toLowerCase())
    const matchEstado = estadoFiltro ? m.estado === estadoFiltro : true
    return matchText && matchEstado
  })

  if (loading) return <div className="p-8 text-center">Cargando memorias...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Memoria de Cálculo</h1><p className="text-sm text-gray-500 mt-1">Cálculos estructurados con versionado</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar memoria..." value={filtro} onChange={e => setFiltro(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="calculado">Calculado</option>
          <option value="verificado">Verificado</option>
          <option value="aprobado">Aprobado</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memoriasFiltradas.map(m => {
          const estado = estados[m.estado] || estados.borrador
          const Icon = estado.icon
          return (
            <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg"><Calculator className="w-5 h-5 text-cyan-600" /></div>
                  <div><h3 className="font-semibold text-gray-900 text-sm">{m.codigo}</h3><p className="text-sm text-gray-500">{m.titulo}</p></div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${estado.color}`}><Icon className="w-3 h-3" /> {m.estado}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4"><span>Normativa: {m.normativa || 'N/A'}</span><span>v{m.version}</span></div>
              <div className="flex items-center gap-2">
                <button onClick={() => abrirEditor(m)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"><Edit className="w-3 h-3" /> Editar</button>
                <button onClick={() => generarPDF(m.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"><FileDown className="w-3 h-3" /> PDF</button>
              </div>
            </div>
          )
        })}
      </div>

      {editorOpen && memoriaEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div><h2 className="text-lg font-bold">{memoriaEdit.titulo}</h2><p className="text-sm text-gray-500">{memoriaEdit.codigo} • v{memoriaEdit.version}</p></div>
              <button onClick={() => setEditorOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6 flex-1 overflow-auto">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Secciones ({secciones.length})</h3>
                {secciones.length === 0 && <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200"><Calculator className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-500">No hay secciones aún. Crea la primera abajo.</p></div>}
                {secciones.map((s, i) => (
                  <div key={s.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">{i+1}</span>
                        <h4 className="font-medium">{s.titulo}</h4>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">{s.tipo}</span>
                      </div>
                      <button className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">{s.contenido}</div>
                    {s.formulas?.length > 0 && <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs font-mono text-blue-800">{s.formulas.map((f, fi) => <div key={fi}>{f}</div>)}</div>}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Nueva Sección</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Título de la sección" value={nuevaSeccion.titulo} onChange={e => setNuevaSeccion({...nuevaSeccion, titulo: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <select value={nuevaSeccion.tipo} onChange={e => setNuevaSeccion({...nuevaSeccion, tipo: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option value="introduccion">Introducción</option><option value="datos">Datos de Entrada</option><option value="metodologia">Metodología</option><option value="calculo">Desarrollo del Cálculo</option><option value="resultados">Resultados</option><option value="conclusiones">Conclusiones</option><option value="anexos">Anexos</option>
                    </select>
                  </div>
                  <textarea placeholder="Contenido en Markdown..." rows={6} value={nuevaSeccion.contenido} onChange={e => setNuevaSeccion({...nuevaSeccion, contenido: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm" />
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg"><p className="font-medium mb-1">Sintaxis soportada:</p><p># Título | ## Subtítulo | **negrita** | *cursiva* | $$fórmula$$ | ```código```</p></div>
                  <button onClick={guardarSeccion} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Save className="w-4 h-4" /> Guardar Sección</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
