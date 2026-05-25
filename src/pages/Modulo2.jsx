import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import NavButtons from '../components/layout/NavButtons'
import { useModuloStore } from '../store/useModuloStore'
import { guardarModulo } from '../services/api'

const ACTIVIDADES_ETL = [
    { id: 'nulos', label: 'Limpieza de nulos', desc: 'similitud_texto → fillna(0)' },
    { id: 'intensidad', label: 'Ingeniería: intensidad_cambios', desc: 'cambios_pestaña / (tiempo_examen / 10)' },
    { id: 'alerta', label: 'Ingeniería: alerta_fraude', desc: 'similitud>40% OR cambios>10 OR biometría_fallo=1' },
    { id: 'tiempo', label: 'Ingeniería: tiempo_examen_min', desc: 'Contextualiza velocidad de respuesta' },
    { id: 'exportacion', label: 'Exportación CSV', desc: 'Integridad_Procesada.csv → auditoría manual' },
    { id: 'estandar', label: 'Estandarización de tipos', desc: 'Conversión de fechas, enteros y flotantes' },
]

export default function Modulo2() {
    const { guardarDatos, avanzar } = useModuloStore()
    const [config, setConfig] = useState({
        herramienta: 'Google Colab + Pandas', frecuencia: 'Por sesión de examen',
        ambiente: 'Nube (Google Colab)', destino: 'PostgreSQL / CSV'
    })
    const [actSel, setActSel] = useState([])
    const [reglasNegocio, setReglas] = useState('')
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    const toggle = (id) => setActSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

    const onNext = async () => {
        setCargando(true)
        try {
            const payload = { config, actividades: actSel, reglasNegocio }
            await guardarModulo(2, payload).catch(() => { })
            guardarDatos('modulo2', payload)
            avanzar(); navigate('/modulo/3')
        } finally { setCargando(false) }
    }

    return (
        <div className="flex min-h-screen bg-surface">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar modulo={2} />
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Staging Area / Proceso ETL</h1>
                        <p className="text-sm text-white/40">
                            Capa 2 — Pipeline de preparación de datos en la nube con Google Colab y Pandas
                        </p>
                    </div>

                    {/* Flujo ETL del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-4">Flujo ETL — según arquitectura del PDF</p>
                        <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
                            {[
                                { label: 'LANDING ZONE', sub: 'RAW DATA', color: 'border-white/20', items: ['Tablas Crudas', 'Validación Inicial', 'Control de Calidad', 'Logs de Carga'] },
                                { label: 'EXTRACT', sub: '(Bigtable)', color: 'border-brand-600/50', items: ['fraude_academico.csv', 'sample_data', 'Datos brutos LMS'] },
                                { label: 'TRANSFORM', sub: 'Google Colab', color: 'border-teal-600/50', items: ['Limpieza nulos', 'intensidad_cambios', 'alerta_fraude', 'tiempo_examen_min'] },
                                { label: 'LOAD', sub: '(Target)', color: 'border-brand-600/50', items: ['Integridad_Procesada.csv', 'Data Warehouse', 'Auditoría manual'] },
                            ].map((fase, i) => (
                                <div key={fase.label} className="flex items-center gap-2">
                                    <div className={`min-w-[140px] border ${fase.color} rounded-xl p-3 bg-white/3`}>
                                        <p className="text-xs font-bold text-white/70 mb-0.5">{fase.label}</p>
                                        <p className="text-xs text-white/25 mb-2">{fase.sub}</p>
                                        {fase.items.map(it => (
                                            <div key={it} className="text-xs bg-white/5 px-2 py-1 rounded mb-1 text-white/40">{it}</div>
                                        ))}
                                    </div>
                                    {i < 3 && <span className="text-white/20 text-lg flex-shrink-0">→</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Config */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Herramienta ETL', key: 'herramienta', opts: ['Google Colab + Pandas', 'Apache Spark', 'Talend', 'dbt + Python'] },
                            { label: 'Frecuencia', key: 'frecuencia', opts: ['Por sesión de examen', 'Tiempo real', 'Diaria', 'Batch nocturno'] },
                            { label: 'Ambiente', key: 'ambiente', opts: ['Nube (Google Colab)', 'Nube (AWS)', 'On-premise', 'Híbrido'] },
                            { label: 'Destino de carga', key: 'destino', opts: ['PostgreSQL / CSV', 'BigQuery', 'Redshift', 'Snowflake'] },
                        ].map(({ label, key, opts }) => (
                            <div key={key} className="bg-white/3 border border-surface-border rounded-xl p-4">
                                <label className="text-xs text-white/40 font-medium block mb-2">{label}</label>
                                <select value={config[key]} onChange={e => setConfig(p => ({ ...p, [key]: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/75">
                                    {opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Actividades ETL */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <label className="text-xs text-white/40 font-medium block mb-3">
                            Actividades de transformación aplicadas (del PDF — Actividad 2)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {ACTIVIDADES_ETL.map(a => (
                                <button key={a.id} type="button" onClick={() => toggle(a.id)}
                                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${actSel.includes(a.id)
                                            ? 'bg-teal-600/15 border-teal-600/35'
                                            : 'bg-white/3 border-white/8 hover:border-white/18'}`}>
                                    <span className={`text-sm flex-shrink-0 mt-0.5 ${actSel.includes(a.id) ? 'text-teal-400' : 'text-white/25'}`}>
                                        {actSel.includes(a.id) ? '✓' : '+'}
                                    </span>
                                    <div>
                                        <p className={`text-xs font-semibold ${actSel.includes(a.id) ? 'text-teal-300' : 'text-white/60'}`}>{a.label}</p>
                                        <p className="text-xs text-white/25 font-mono mt-0.5">{a.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reglas del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <label className="text-xs text-white/40 font-medium block mb-2">Reglas de negocio del ETL</label>
                        <textarea rows={5} value={reglasNegocio} onChange={e => setReglas(e.target.value)}
                            placeholder={`Reglas del PDF:\n• alerta_fraude = 1 si similitud_texto > 40%\n• alerta_fraude = 1 si cambios_pestaña > 10\n• alerta_fraude = 1 si fallo_biometrico = 1\n• intensidad_cambios = cambios_pestaña / (tiempo_examen_min / 10)\n• tiempo_examen_min → detectar respuesta automatizada`}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 font-mono resize-none placeholder:text-white/20" />
                    </div>
                </div>
                <NavButtons onNext={onNext} cargando={cargando} />
            </div>
        </div>
    )
}