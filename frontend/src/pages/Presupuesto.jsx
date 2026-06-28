import { useEffect, useState } from 'react'
import api from '../api/axios'
import { DollarSign, ChevronDown, ChevronUp, TrendingUp, Calculator, FileText } from 'lucide-react'

export default function Presupuesto() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})

  useEffect(() => { cargarPresupuesto() }, [])

  const cargarPresupuesto = async () => {
    try {
      const res = await api.get('/presupuesto/categorias/')
      setCategorias(res.data.results || res.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const totalGeneralUsd = categorias.reduce((s, c) => s + (c.total_usd || 0), 0)
  const totalGeneralCop = categorias.reduce((s, c) => s + (c.total_cop || 0), 0)

  const formatUsd = (v) => {
    if (v == null) return 'US$ 0.00'
    return 'US$ ' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatCop = (v) => {
    if (v == null) return '$ 0'
    return '$ ' + Math.round(v).toLocaleString('es-CO')
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: '#1e3a5f', borderTopColor: '#667EEA' }}></div></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Presupuesto CAPEX</h1>
          <p className="text-sm text-slate-500 mt-1">Inversion inicial - Planta Desalinizadora Manaure</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total USD</p>
            <p className="text-xl font-extrabold" style={{ color: '#667EEA' }}>{formatUsd(totalGeneralUsd)}</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total COP</p>
            <p className="text-xl font-extrabold" style={{ color: '#764BA2' }}>{formatCop(totalGeneralCop)}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="font-bold">Resumen por Categoria</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {categorias.map(cat => (
            <div key={cat.id}>
              <div
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => toggleExpand(cat.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, #667EEA, #764BA2)` }}>
                    {cat.orden}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{cat.nombre}</p>
                    <p className="text-xs text-slate-400">{cat.partidas?.length || 0} partidas</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#667EEA' }}>{formatUsd(cat.total_usd)}</p>
                    <p className="text-xs" style={{ color: '#764BA2' }}>{formatCop(cat.total_cop)}</p>
                  </div>
                  {expanded[cat.id] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
              {expanded[cat.id] && (
                <div className="bg-slate-50 border-t border-slate-100">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="w-12 text-center">#</th>
                        <th>Descripcion</th>
                        <th className="w-16 text-center">Cant</th>
                        <th className="w-16">Unidad</th>
                        <th className="w-28 text-right">Costo Unit USD</th>
                        <th className="w-28 text-right">Costo Unit COP</th>
                        <th className="w-28 text-right">Total USD</th>
                        <th className="w-28 text-right">Total COP</th>
                        <th className="w-40">Notas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.partidas?.map(p => (
                        <tr key={p.id}>
                          <td className="text-center text-slate-500 text-xs">{p.numero}</td>
                          <td className="text-sm font-medium text-slate-700">{p.descripcion}</td>
                          <td className="text-center text-sm">{p.cantidad}</td>
                          <td className="text-sm text-slate-500">{p.unidad}</td>
                          <td className="text-right text-sm font-mono">{formatUsd(parseFloat(p.costo_unitario_usd))}</td>
                          <td className="text-right text-sm font-mono">{formatCop(parseFloat(p.costo_unitario_cop))}</td>
                          <td className="text-right text-sm font-bold font-mono" style={{ color: '#667EEA' }}>{formatUsd(p.total_usd)}</td>
                          <td className="text-right text-sm font-mono" style={{ color: '#764BA2' }}>{formatCop(p.total_cop)}</td>
                          <td className="text-xs text-slate-400">{p.notas}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-white font-bold">
                        <td colSpan="6" className="text-right text-sm">Subtotal {cat.nombre}</td>
                        <td className="text-right text-sm" style={{ color: '#667EEA' }}>{formatUsd(cat.total_usd)}</td>
                        <td className="text-right text-sm" style={{ color: '#764BA2' }}>{formatCop(cat.total_cop)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t-2 border-slate-200">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-bold text-slate-800">TOTAL CAPEX (sin contingencia)</p>
              <div className="text-right">
                <p className="font-bold text-lg" style={{ color: '#667EEA' }}>{formatUsd(totalGeneralUsd)}</p>
                <p className="text-sm font-semibold" style={{ color: '#764BA2' }}>{formatCop(totalGeneralCop)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-dashed border-slate-200">
              <p className="text-slate-600">Contingencia / Imprevistos (10%)</p>
              <div className="text-right">
                <p className="font-semibold" style={{ color: '#F59E0B' }}>{formatUsd(totalGeneralUsd * 0.1)}</p>
                <p className="text-sm" style={{ color: '#F59E0B' }}>{formatCop(totalGeneralCop * 0.1)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-t-2 border-slate-300">
              <p className="text-xl font-extrabold text-slate-800">TOTAL CAPEX (con contingencia)</p>
              <div className="text-right">
                <p className="text-xl font-extrabold" style={{ color: '#667EEA' }}>{formatUsd(totalGeneralUsd * 1.1)}</p>
                <p className="text-base font-bold" style={{ color: '#764BA2' }}>{formatCop(totalGeneralCop * 1.1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
