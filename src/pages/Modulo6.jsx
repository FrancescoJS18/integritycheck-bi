import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import NavButtons from '../components/layout/NavButtons'
import { useModuloStore } from '../store/useModuloStore'
import { guardarModulo } from '../services/api'

const MODULOS_ETL = [
    {
        id: 'm1', titulo: 'Módulo 1 — Gestión de Usuarios',
        tabla: 'Fact_Actividad_Usuario',
        dims: ['Dim_Usuario', 'Dim_Examen', 'Dim_Tiempo', 'Dim_Incidente'],
        variables: ['similitud_texto', 'cambios_pestana', 'duracion_actividad', 'fallo_biometrico'],
        resultado: 'Accuracy: 100% · Precisión: 100%',
        color: 'brand',
    },
    {
        id: 'm2', titulo: 'Módulo 2 — Monitoreo de Exámenes',
        tabla: 'Fact_Rendimiento',
        dims: ['Dim_Estudiante', 'Dim_Curso', 'Dim_Tiempo', 'Dim_Dispositivo', 'Dim_Ubicacion'],
        variables: ['cantidad_tab_switch', 'tiempo_examen_min', 'similitud_texto', 'score_biometria'],
        resultado: 'Accuracy: 1.00 · Precisión: 1.00',
        color: 'teal',
    },
    {
        id: 'm3', titulo: 'Módulo 3 — Alertas y Auditoría',
        tabla: 'Fact_Alertas_Auditoria',
        dims: ['Dim_Estudiante', 'Dim_Examen', 'Dim_Tipo_Alerta', 'Dim_Auditoria', 'Dim_Tiempo'],
        variables: ['score_severidad', 'cantidad_evidencias', 'tiempo_revision_minutos', 'id_tipo_alerta'],
        resultado: 'Accuracy: 1.00 · Precisión: 1.00',
        color: 'coral',
    },
    {
        id: 'm4', titulo: 'Módulo 4 — Gestión Académica',
        tabla: 'Fact_Gestion_Academica',
        dims: ['Dim_Curso', 'Dim_Docente', 'Dim_Periodo', 'Dim_Facultad'],
        variables: ['cantidad_examenes', 'promedio_notas', 'asistencia_digital', 'creditos_curso'],
        resultado: 'Accuracy: 1.00 · Precisión: 1.00',
        color: 'amber',
    },
]

const METODOS_CIENCIA_DATOS = [
    { id: 'regresion', icon: '📈', titulo: 'Regresión', desc: 'Predice el promedio final de una sección según horas en LMS e historial de calificaciones previas. Anticipa resultados antes del cierre del ciclo.' },
    { id: 'clustering', icon: '🔵', titulo: 'Clustering', desc: 'Categoriza a los docentes en perfiles según innovación pedagógica y uso de herramientas digitales. Diseña programas de formación personalizados.' },
    { id: 'ml', icon: '🤖', titulo: 'Machine Learning', desc: 'Árbol de decisión que clasifica docentes en "Riesgo Alto" o "Riesgo Bajo". Automatiza alertas pedagógicas: satisfacción < 3.5 + aprobación < 60%.' },
    { id: 'predictiva', icon: '🔮', titulo: 'Analítica predictiva', desc: 'Predice riesgo de deserción estudiantil antes del abandono formal. Convierte dashboard tradicional en sistema de alerta temprana.' },
]

export default function Modulo6() {
    const { guardarDatos, avanzar } = useModuloStore()
    const [moduloActivo, setModuloActivo] = useState('m1')
    const [metodosSel, setMetodosSel] = useState([])
    const [preguntasRef, setPreguntasRef] = useState({ p1: '', p2: '', p3: '' })
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    const toggleMetodo = (id) => setMetodosSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

    const onNext = async () => {
        setCargando(true)
        try {
            const payload = { moduloETL: moduloActivo, metodos: metodosSel, preguntasRef }
            await guardarModulo(6, payload).catch(() => { })
            guardarDatos('modulo6', payload)
            avanzar(); navigate('/modulo/7')
        } finally { setCargando(false) }
    }

    const mod = MODULOS_ETL.find(m => m.id === moduloActivo)

    const colorClasses = {
        brand: { bg: 'bg-brand-600/20', border: 'border-brand-600/40', text: 'text-brand-200', dot: 'bg-brand-400' },
        teal: { bg: 'bg-teal-600/20', border: 'border-teal-600/40', text: 'text-teal-200', dot: 'bg-teal-400' },
        coral: { bg: 'bg-coral-600/20', border: 'border-coral-600/40', text: 'text-coral-200', dot: 'bg-orange-400' },
        amber: { bg: 'bg-amber-600/20', border: 'border-amber-600/40', text: 'text-amber-200', dot: 'bg-amber-400' },
    }

    return (
        <div className="flex min-h-screen bg-surface">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar modulo={6} />
                <div className="flex-1 p-6 overflow-y-auto space-y-5">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Analítica avanzada</h1>
                        <p className="text-sm text-white/40">
                            Capa 6 — Simulaciones ETL en la nube y métodos de ciencia de datos aplicados al BI
                        </p>
                    </div>

                    {/* Selector de módulos ETL */}
                    <div className="grid grid-cols-4 gap-2">
                        {MODULOS_ETL.map(m => {
                            const c = colorClasses[m.color]
                            return (
                                <button key={m.id} type="button" onClick={() => setModuloActivo(m.id)}
                                    className={`p-3 rounded-xl border text-left transition-all ${moduloActivo === m.id
                                            ? `${c.bg} ${c.border}`
                                            : 'bg-white/3 border-white/8 hover:border-white/18'}`}>
                                    <p className={`text-xs font-bold mb-1 ${moduloActivo === m.id ? c.text : 'text-white/55'}`}>
                                        {m.id.toUpperCase()}
                                    </p>
                                    <p className="text-xs text-white/40 leading-tight">{m.titulo.split('—')[1]?.trim()}</p>
                                </button>
                            )
                        })}
                    </div>

                    {/* Detalle del módulo seleccionado */}
                    {mod && (
                        <div className="bg-white/3 border border-surface-border rounded-xl p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-white mb-1">{mod.titulo}</h2>
                                    <p className="text-xs text-white/30">Tabla de hechos: <span className="text-brand-200 font-mono">{mod.tabla}</span></p>
                                </div>
                                <span className="text-xs bg-teal-600/20 border border-teal-600/30 text-teal-300 px-2.5 py-1 rounded-lg font-semibold">
                                    {mod.resultado}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-white/30 font-semibold mb-2">Dimensiones del Data Mart</p>
                                    <div className="space-y-1.5">
                                        {mod.dims.map(d => (
                                            <div key={d} className="flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 px-3 py-2 rounded-lg">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                                                <span className="text-xs text-brand-200 font-mono">{d}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-white/30 font-semibold mb-2">Variables del modelo ML</p>
                                    <div className="space-y-1.5">
                                        {mod.variables.map(v => (
                                            <div key={v} className="flex items-center gap-2 bg-teal-600/10 border border-teal-600/20 px-3 py-2 rounded-lg">
                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                                <span className="text-xs text-teal-200 font-mono">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Árbol simplificado del módulo */}
                            <div>
                                <p className="text-xs text-white/30 font-semibold mb-2">Vista previa del árbol de decisión</p>
                                <svg viewBox="0 0 600 160" className="w-full bg-white/2 rounded-lg">
                                    <line x1="300" y1="45" x2="160" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                                    <line x1="300" y1="45" x2="440" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                                    <rect x="175" y="12" width="250" height="44" rx="8" fill="rgba(108,92,231,0.25)" stroke="#6c5ce7" strokeWidth="1" />
                                    <text x="300" y="33" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
                                        {mod.variables[0]} &lt;= umbral
                                    </text>
                                    <text x="300" y="48" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">
                                        gini = 0.469  ·  samples = 80
                                    </text>
                                    <text x="230" y="88" fill="rgba(255,255,255,0.25)" fontSize="8">True</text>
                                    <text x="375" y="88" fill="rgba(255,255,255,0.25)" fontSize="8">False</text>
                                    <rect x="75" y="100" width="170" height="40" rx="7" fill="rgba(29,158,117,0.25)" stroke="#1d9e75" strokeWidth="0.75" />
                                    <text x="160" y="124" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">✓ Normal / No Fraude</text>
                                    <rect x="355" y="100" width="170" height="40" rx="7" fill="rgba(216,90,48,0.25)" stroke="#d85a30" strokeWidth="0.75" />
                                    <text x="440" y="124" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">⚠ Fraude / Crítico</text>
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Métodos de ciencia de datos del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">
                            Métodos de ciencia de datos aplicados al BI (Actividad no lectiva del PDF)
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {METODOS_CIENCIA_DATOS.map(m => (
                                <button key={m.id} type="button" onClick={() => toggleMetodo(m.id)}
                                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${metodosSel.includes(m.id)
                                            ? 'bg-brand-600/20 border-brand-600/40'
                                            : 'bg-white/3 border-white/8 hover:border-white/18'}`}>
                                    <span className="text-2xl flex-shrink-0">{m.icon}</span>
                                    <div className="flex-1">
                                        <p className={`text-xs font-bold mb-1 ${metodosSel.includes(m.id) ? 'text-brand-100' : 'text-white/70'}`}>{m.titulo}</p>
                                        <p className="text-xs text-white/35 leading-relaxed">{m.desc}</p>
                                    </div>
                                    {metodosSel.includes(m.id) && <span className="text-teal-400 flex-shrink-0 font-bold">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preguntas reflexivas del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-4">
                            Preguntas reflexivas — Sesión 2 del PDF (responde en base al sistema)
                        </p>
                        <div className="space-y-4">
                            {[
                                { key: 'p1', pregunta: '¿Por qué el modelo dimensional en esquema estrella es más eficiente que una BD normalizada para consultas de detección de fraude en tiempo real?' },
                                { key: 'p2', pregunta: '¿Qué información nueva aportan las dimensiones "tipo_alerta" y "estado_academico" que no podría obtenerse solo con las métricas numéricas?' },
                                { key: 'p3', pregunta: '¿Cómo se complementan la simulación ETL en Google Colab y la arquitectura operacional para cerrar el ciclo de detección de fraude?' },
                            ].map(({ key, pregunta }) => (
                                <div key={key}>
                                    <div className="flex items-start gap-2 mb-2">
                                        <span className="text-xs font-bold text-brand-400 flex-shrink-0">{key.toUpperCase()}</span>
                                        <p className="text-xs text-white/50 italic">{pregunta}</p>
                                    </div>
                                    <textarea rows={3} value={preguntasRef[key]}
                                        onChange={e => setPreguntasRef(p => ({ ...p, [key]: e.target.value }))}
                                        placeholder="Escribe tu respuesta aquí..."
                                        className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 resize-none placeholder:text-white/20 focus:border-brand-400 outline-none transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <NavButtons onNext={onNext} cargando={cargando} />
            </div>
        </div>
    )
}