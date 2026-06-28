import { useState, useEffect } from 'react'
import api from '../api/axios'
import { FileText, Upload, Search, Download, History, Eye, X, File, Image, FileSpreadsheet } from 'lucide-react'

export default function Documentos() {
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [uploadModal, setUploadModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [versiones, setVersiones] = useState([])
  const [nuevoDoc, setNuevoDoc] = useState({ capitulo: '', codigo: '', nombre: '', tipo: 'especificacion', formato: 'pdf', descripcion: '', archivo: null })

  useEffect(() => { cargarDocumentos() }, [])
  const cargarDocumentos = async () => {
    try { const res = await api.get('/documentos/'); setDocumentos(res.data.results || res.data) } catch (e) { console.error(e) }
    setLoading(false)
  }
  const cargarVersiones = async (docId) => {
    try { const res = await api.get(`/versionado/?object_id=${docId}`); setVersiones(res.data.results || res.data) } catch (e) { setVersiones([]) }
  }
  const subirDocumento = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.keys(nuevoDoc).forEach(k => { if (nuevoDoc[k]) formData.append(k, nuevoDoc[k]) })
    try { await api.post('/documentos/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); setUploadModal(false); setNuevoDoc({ capitulo: '', codigo: '', nombre: '', tipo: 'especificacion', formato: 'pdf', descripcion: '', archivo: null }); cargarDocumentos() } catch (e) { alert('Error al subir documento') }
  }

  const iconosFormato = {
    pdf: <FileText className="w-5 h-5 text-red-500" />, docx: <File className="w-5 h-5 text-blue-500" />,
    xlsx: <FileSpreadsheet className="w-5 h-5 text-green-500" />, dwg: <File className="w-5 h-5 text-orange-500" />,
    md: <FileText className="w-5 h-5 text-gray-500" />, jpg: <Image className="w-5 h-5 text-purple-500" />,
    png: <Image className="w-5 h-5 text-purple-500" />,
  }

  const docsFiltrados = documentos.filter(d => {
    const matchText = (d.nombre + d.codigo).toLowerCase().includes(filtro.toLowerCase())
    const matchTipo = tipoFiltro ? d.tipo === tipoFiltro : true
    return matchText && matchTipo
  })

  if (loading) return <div className="p-8 text-center">Cargando documentos...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Documentos Técnicos</h1><p className="text-sm text-gray-500 mt-1">Gestión y versionado de documentos</p></div>
        <button onClick={() => setUploadModal(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Upload className="w-4 h-4" /> Subir Documento</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar documento..." value={filtro} onChange={e => setFiltro(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="">Todos los tipos</option>
          <option value="especificacion">Especificación</option>
          <option value="planos">Planos</option>
          <option value="informe">Informe</option>
          <option value="acta">Acta</option>
          <option value="correspondencia">Correspondencia</option>
          <option value="anexo">Anexo</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr><th className="px-4 py-3 text-left font-medium text-gray-600">Documento</th><th className="px-4 py-3 text-left font-medium text-gray-600">Tipo</th><th className="px-4 py-3 text-left font-medium text-gray-600">Capítulo</th><th className="px-4 py-3 text-left font-medium text-gray-600">Versión</th><th className="px-4 py-3 text-left font-medium text-gray-600">Estado</th><th className="px-4 py-3 text-right font-medium text-gray-600">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {docsFiltrados.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><div className="flex items-center gap-3">{iconosFormato[d.formato] || <FileText className="w-5 h-5 text-gray-400" />}<div><p className="font-medium text-gray-900">{d.nombre}</p><p className="text-xs text-gray-500">{d.codigo}</p></div></div></td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">{d.tipo}</span></td>
                <td className="px-4 py-3 text-gray-600">{d.capitulo_nombre || '-'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${d.es_version_actual ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>v{d.version} {d.es_version_actual ? '(actual)' : ''}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${d.es_version_actual ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{d.es_version_actual ? 'Activo' : 'Archivado'}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setSelectedDoc(d); cargarVersiones(d.id) }} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Versiones"><History className="w-4 h-4 text-gray-500" /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Descargar"><Download className="w-4 h-4 text-gray-500" /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Ver"><Eye className="w-4 h-4 text-gray-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {uploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between"><h2 className="text-lg font-bold">Subir Documento</h2><button onClick={() => setUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button></div>
            <form onSubmit={subirDocumento} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Código</label><input required value={nuevoDoc.codigo} onChange={e => setNuevoDoc({...nuevoDoc, codigo: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Capítulo</label><input required value={nuevoDoc.capitulo} onChange={e => setNuevoDoc({...nuevoDoc, capitulo: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="ID del capítulo" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label><input required value={nuevoDoc.nombre} onChange={e => setNuevoDoc({...nuevoDoc, nombre: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label><select value={nuevoDoc.tipo} onChange={e => setNuevoDoc({...nuevoDoc, tipo: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"><option value="especificacion">Especificación</option><option value="planos">Planos</option><option value="informe">Informe</option><option value="acta">Acta</option><option value="correspondencia">Correspondencia</option><option value="anexo">Anexo</option><option value="otro">Otro</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Formato</label><select value={nuevoDoc.formato} onChange={e => setNuevoDoc({...nuevoDoc, formato: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"><option value="pdf">PDF</option><option value="dwg">DWG</option><option value="docx">Word</option><option value="xlsx">Excel</option><option value="md">Markdown</option><option value="jpg">JPG</option><option value="png">PNG</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Archivo</label><input type="file" onChange={e => setNuevoDoc({...nuevoDoc, archivo: e.target.files[0]})} className="w-full px-3 py-2 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label><textarea value={nuevoDoc.descripcion} onChange={e => setNuevoDoc({...nuevoDoc, descripcion: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              <div className="flex gap-3 pt-4"><button type="button" onClick={() => setUploadModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button><button type="submit" className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Subir</button></div>
            </form>
          </div>
        </div>
      )}

      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between"><h2 className="text-lg font-bold">Historial de Versiones - {selectedDoc.nombre}</h2><button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button></div>
            <div className="p-6">
              {versiones.length === 0 ? <p className="text-center text-gray-500 py-8">No hay versiones registradas</p> : (
                <div className="space-y-3">
                  {versiones.map(v => (
                    <div key={v.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xs">v{v.numero_version}</div>
                      <div className="flex-1"><p className="text-sm font-medium capitalize">{v.accion}</p><p className="text-xs text-gray-500">{v.realizado_por?.first_name} {v.realizado_por?.last_name} • {new Date(v.fecha).toLocaleString()}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
