import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import { useModuloStore } from '../store/useModuloStore'
import { guardarModulo } from '../services/api'
import { ShieldCheck, ExternalLink, CheckCircle, Loader2, BarChart3 } from 'lucide-react'

const POWER_BI_URL = 'TU_LINK_DE_POWER_BI_AQUI'

const RESUMEN_MODULOS = [
    { num: 1, icon: '🗄️', label: 'Fuentes de datos', desc: 'LMS, Biometría, Similitud, Historial, Keystroke' },
    { num: 2, icon: '⚙️', label: 'Staging / ETL', desc: 'Google Colab + Pandas, alerta_fraude, intensidad_cambios' },
    { num: 3, icon: '❄️', label: 'Data Warehouse', desc: 'Copo de nieve — Fact_Actividad_Usuario + 6 dims' },
    { num: 4, icon: '🤖', label: 'Capa IA (Python)', desc: 'DecisionTreeClassifier — predicción fraude en tiempo real' },
    { num: 5, icon: '📊', label: 'KPIs semánticos', desc: 'Tasa sospechosos, falsos positivos, tiempo detección' },
    { num: 6, icon: '🔬', label: 'Analítica avanzada', desc: 'Módulos ETL simulados, árbol de decisión, ML' },
]

export default function Modulo7() {
    const { guardarDatos, completados, userName } = useModuloStore()
    const [mostrarDash, setMostrarDash] = useState(false)
    const [guardado, setGuardado] = useState(false)
    const [cargando, setCargando] = useState(false)

    const handleFinalizar = async () => {
        setCargando(true)
        try {
            await guardarModulo(7, { completado: true }).catch(() => { })
            guardarDatos('modulo7', { completado: true })
            setGuardado(true)
        } finally { setCargando(false) }
    }

    return (
        <div className="flex min-h-screen bg-surface">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar modulo={7} />
                <div className="flex-1 p-6 overflow-y-auto space-y-5">

                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Visualización BI — Power BI</h1>
                        <p className="text-sm text-white/40">
                            Capa 7 — Dashboard ejecutivo generado con los datos de los 6 módulos anteriores
                        </p>
                    </div>

                    {/* Resumen de módulos completados */}
                    <div>
                        <p className="text-xs text-white/30 font-semibold uppercase tracking-widest mb-3">
                            Resumen de la arquitectura completada
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {RESUMEN_MODULOS.map(m => {
                                const done = completados.includes(`modulo${m.num}`)
                                return (
                                    <div key={m.num} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${done ? 'bg-teal-600/10 border-teal-600/25' : 'bg-white/3 border-surface-border'}`}>
                                        <span className="text-xl flex-shrink-0">{m.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-white/70">{m.num}. {m.label}</p>
                                            <p className="text-xs text-white/25 leading-tight mt-0.5">{m.desc}</p>
                                        </div>
                                        {done && <CheckCircle size={13} className="text-teal-400 flex-shrink-0 mt-0.5" />}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* KPIs del PDF */}
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: 'Tasa exámenes sospechosos', valor: '≤ 10%', color: 'text-brand-400' },
                            { label: 'Tiempo detección alerta', valor: '≤ 5 seg', color: 'text-teal-400' },
                            { label: 'Tasa falsos positivos', valor: '≤ 5%', color: 'text-brand-400' },
                            { label: 'Precisión modelo IA', valor: '≥ 90%', color: 'text-teal-400' },
                        ].map(k => (
                            <div key={k.label} className="bg-white/4 border border-surface-border rounded-xl p-4 text-center">
                                <p className={`text-xl font-bold ${k.color} mb-1`}>{k.valor}</p>
                                <p className="text-xs text-white/35 leading-tight">{k.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Botón Power BI */}
                    <div className="bg-gradient-to-br from-brand-600/15 to-brand-900/20 border border-brand-600/25 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-brand-600/25 border border-brand-600/35 flex items-center justify-center mx-auto mb-4">
                            <BarChart3 size={32} className="text-brand-100" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Dashboard Power BI</h2>
                        <p className="text-sm text-white/40 mb-1">IntegrityCheck AI — Detección de Fraude Académico</p>
                        <p className="text-xs text-white/25 mb-6 max-w-md mx-auto">
                            Incluye: distribución de fraude, árbol de decisiones, KPIs en tiempo real,
                            tasa de falsos positivos, alertas por curso y matriz de confusión
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <button onClick={() => setMostrarDash(!mostrarDash)}
                                className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all">
                                <BarChart3 size={18} />
                                {mostrarDash ? 'Ocultar dashboard' : 'Ver dashboard Power BI'}
                            </button>
                            <a href={POWER_BI_URL} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 border border-white/15 hover:bg-white/5 text-white/55 hover:text-white/80 font-medium rounded-xl transition-all">
                                <ExternalLink size={16} /> Abrir en nueva pestaña
                            </a>
                        </div>
                    </div>

                    {/* Iframe */}
                    {mostrarDash && (
                        <div className="bg-white/3 border border-surface-border rounded-2xl overflow-hidden">
                            {POWER_BI_URL === 'TU_LINK_DE_POWER_BI_AQUI' ? (
                                <div className="h-96 flex flex-col items-center justify-center text-center p-8">
                                    <ShieldCheck size={40} className="text-white/15 mb-4" />
                                    <p className="text-white/40 text-sm font-semibold mb-2">Dashboard Power BI — IntegrityCheck AI</p>
                                    <p className="text-white/25 text-xs max-w-xs mb-4">
                                        Reemplaza <code className="bg-white/10 px-1.5 py-0.5 rounded text-brand-200">POWER_BI_URL</code> en
                                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-brand-200 ml-1">Modulo7.jsx</code> con
                                        el link embed de Power BI Service
                                    </p>
                                    <p className="text-white/15 text-xs">
                                        Power BI Service → Publicar → Obtener link → Insertar → Sitio web o portal
                                    </p>
                                </div>
                            ) : (
                                <iframe title="Dashboard IntegrityCheck AI" src={POWER_BI_URL}
                                    className="w-full h-[600px] border-0" allowFullScreen />
                            )}
                        </div>
                    )}

                    {/* Finalizar */}
                    <div className="flex justify-center pb-4">
                        {guardado ? (
                            <div className="flex items-center gap-2 text-teal-400 font-semibold">
                                <CheckCircle size={18} /> ¡Plataforma IntegrityCheck AI completada exitosamente!
                            </div>
                        ) : (
                            <button onClick={handleFinalizar} disabled={cargando}
                                className="flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-400 text-white font-bold rounded-xl transition-all disabled:opacity-50">
                                {cargando ? <><Loader2 size={16} className="animate-spin" />Guardando...</> : '✓ Finalizar plataforma BI'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}