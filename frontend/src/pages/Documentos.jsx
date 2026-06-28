import { useEffect, useState } from 'react'
import api from '../api/axios'
import { FilePlus, Search, Filter, Download, Eye, FileText, FileSpreadsheet, FileImage, FileArchive, Trash2, Clock, CheckCircle } from 'lucide-react'

export default function Documentos() {
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [tipoFiltro, setTipoFiltro] = useState('todos')

  useEffect(() => { cargarDocumentos() }, [])

  const cargarDocumentos = async () => {
    try {
      const res = await api.get('/documentos/')
      setDocumentos(res.data.results || res.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const getFileIcon = (tipo) => {
    switch(tipo?.toLowerCase()) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500"/>
      case 'xlsx': case 'xls': return <FileSpreadsheet className="w-8 h-8 text-emerald-500"/>
      case 'jpg': case 'png': case 'jpeg': return <FileImage className="w-8 h-8 text-purple-500"/>
      default: return <FileArchive className="w-8 h-8 text-slate-400"/>
    }
  }

  const getFileBadge = (tipo) => {
    switch(tipo?.toLowerCase()) {
      case 'pdf': return <span className="badge-danger">PDF</span>
      case 'xlsx': case 'xls': return <span className="badge-success">Excel</span>
      case 'jpg': case 'png': return <span className="badge-info">Imagen</span>
      default: return <span className="badge-gray">{tipo?.toUpperCase()}</span>
    }
  }

  const documentosFiltrados = tipoFiltro === 'todos' 
    ? documentos 
    : documentos.filter(d => d.tipo?.toLowerCase() === tipoFiltro)

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: '#1e3a5f', borderTopColor: '#667EEA' }}></div></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Documentos</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión documental de proyectos y capítulos</p>
        </div>
        <button className="btn-primary">
          <FilePlus className="w-4 h-4"/> Subir Documento
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: documentos.length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'PDFs', value: documentos.filter(d => d.tipo === 'pdf').length, icon: FileText, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Excel', value: documentos.filter(d => ['xlsx','xls'].includes(d.tipo)).length, icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Imágenes', value: documentos.filter(d => ['jpg','png','jpeg'].includes(d.tipo)).length, icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50' },
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

      <div className="flex flex-wrap gap-2">
        {['todos', 'pdf', 'xlsx', 'jpg'].map(tipo => (
          <button 
            key={tipo}
            onClick={() => setTipoFiltro(tipo)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tipoFiltro === tipo ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'}`}
          >
            {tipo === 'todos' ? 'Todos' : tipo.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentosFiltrados.map(doc => (
          <div key={doc.id} className="card hover:shadow-lg transition-all duration-300 group">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  {getFileIcon(doc.tipo)}
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                    <Eye className="w-4 h-4"/>
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors">
                    <Download className="w-4 h-4"/>
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-slate-800 mb-1 truncate">{doc.nombre}</h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{doc.descripcion || 'Sin descripción'}</p>
              <div className="flex items-center justify-between">
                {getFileBadge(doc.tipo)}
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3"/>
                  {new Date(doc.fecha_subida).toLocaleDateString('es-CO')}
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">{doc.proyecto?.codigo || 'Sin proyecto'}</span>
              <span className="text-xs font-medium text-indigo-600">{doc.tamano || '—'}</span>
            </div>
          </div>
        ))}
        {documentosFiltrados.length === 0 && (
          <div className="col-span-full card p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300"/>
            <p>No hay documentos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  )
}
