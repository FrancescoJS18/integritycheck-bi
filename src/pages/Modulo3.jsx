import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import NavButtons from '../components/layout/NavButtons'
import { useModuloStore } from '../store/useModuloStore'
import { guardarModulo } from '../services/api'

const METRICAS = [
    { id: 'nota', label: 'nota', desc: 'Calificación obtenida en el examen' },
    { id: 'tiempo', label: 'tiempo_examen_min', desc: 'Duración total del examen en minutos' },
    { id: 'similitud', label: 'porcentaje_similitud', desc: 'Nivel de coincidencia con fuentes externas' },
    { id: 'cambios', label: 'cantidad_cambios_pestana', desc: 'Número de veces que el alumno perdió el foco' },
    { id: 'riesgo', label: 'nivel_riesgo_num', desc: 'Probabilidad numérica de fraude (0-1)' },
    { id: 'score', label: 'nivel_sospecha_score', desc: 'Puntaje de sospecha generado por la IA' },
    { id: 'duracion', label: 'duracion_actividad', desc: 'Tiempo activo en la plataforma LMS' },
    { id: 'biometrico', label: 'fallo_biometrico', desc: '0=OK / 1=fallo en verificación facial' },
]

const DIMENSIONES = [
    { id: 'usuario', label: 'Dim_Usuario', color: 'teal', campos: ['id_usuario PK', 'nombre', 'tipo_usuario', 'curso', 'facultad'] },
    { id: 'examen', label: 'Dim_Examen', color: 'teal', campos: ['id_examen PK', 'nombre_examen', 'curso', 'plataforma_lms'] },
    { id: 'tiempo', label: 'Dim_Tiempo', color: 'teal', campos: ['id_tiempo PK', 'fecha', 'semestre', 'ciclo', 'turno'] },
    { id: 'incidente', label: 'Dim_Incidente', color: 'teal', campos: ['id_incidente PK', 'tipo_incidente', 'estado_final', 'nivel_gravedad'] },
    { id: 'dispositivo', label: 'Dim_Dispositivo', color: 'coral', campos: ['id_dispositivo PK', 'tipo', 'sistema_operativo', 'navegador'] },
    { id: 'ubicacion', label: 'Dim_Ubicacion', color: 'coral', campos: ['id_ubicacion PK', 'pais', 'ciudad', 'region', 'zona'] },
]

export default function Modulo3() {
    const { guardarDatos, avanzar } = useModuloStore()
    const [form, setForm] = useState({ nombreDW: 'IntegrityCheck_DW', motor: 'PostgreSQL', carga: 'Incremental', granularidad: 'Por sesión de examen' })
    const [metricasSel, setMetricasSel] = useState([])
    const [dimsSel, setDimsSel] = useState([])
    const [dimDetalle, setDimDetalle] = useState(null)
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    const toggleM = (id) => setMetricasSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
    const toggleD = (id) => setDimsSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

    const onNext = async () => {
        setCargando(true)
        try {
            const payload = { form, metricas: metricasSel, dimensiones: dimsSel }
            await guardarModulo(3, payload).catch(() => { })
            guardarDatos('modulo3', payload)
            avanzar(); navigate('/modulo/4')
        } finally { setCargando(false) }
    }

    return (
        <div className="flex min-h-screen bg-surface">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar modulo={3} />
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Data Warehouse — Modelo Copo de Nieve</h1>
                        <p className="text-sm text-white/40">
                            Capa 3 — Almacén central con modelo dimensional normalizado para análisis de fraude académico
                        </p>
                    </div>

                    {/* Configuración del DW */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 bg-white/3 border border-surface-border rounded-xl p-4">
                            <label className="text-xs text-white/40 font-medium block mb-2">Nombre del Data Warehouse</label>
                            <input value={form.nombreDW} onChange={e => setForm(p => ({ ...p, nombreDW: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/80" />
                        </div>
                        {[
                            { label: 'Motor de base de datos', key: 'motor', opts: ['PostgreSQL', 'SQL Server', 'BigQuery', 'Redshift', 'Snowflake'] },
                            { label: 'Granularidad', key: 'granularidad', opts: ['Por sesión de examen', 'Por alumno/día', 'Por pregunta', 'Por hora'] },
                            { label: 'Tipo de modelo', key: 'tipoModelo', opts: ['Copo de nieve (Snowflake Schema)', 'Estrella (Star Schema)', 'Galaxy Schema'] },
                            { label: 'Estrategia de carga', key: 'carga', opts: ['Incremental', 'Full Load', 'Change Data Capture', 'Streaming'] },
                        ].map(({ label, key, opts }) => (
                            <div key={key} className="bg-white/3 border border-surface-border rounded-xl p-4">
                                <label className="text-xs text-white/40 font-medium block mb-2">{label}</label>
                                <select value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/75">
                                    {opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Diagrama copo de nieve */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs text-white/35 font-semibold uppercase tracking-widest">
                                Esquema copo de nieve — IntegrityCheck AI
                            </p>
                            {dimDetalle && (
                                <button onClick={() => setDimDetalle(null)}
                                    className="text-xs text-white/30 hover:text-white/60 border border-white/10 px-2 py-1 rounded-lg">
                                    ✕ cerrar detalle
                                </button>
                            )}
                        </div>

                        <div className="flex gap-4">
                            {/* SVG */}
                            <svg viewBox="0 0 620 420" className={dimDetalle ? 'w-[55%]' : 'w-full'} style={{ transition: 'width 0.3s' }}>
                                {/* Líneas fact → dims */}
                                {[[310, 95], [140, 195], [480, 195], [140, 295], [480, 295]].map((p, i) => (
                                    <line key={i} x1="310" y1="95" x2={p[0]} y2={p[1]}
                                        stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="5 3" />
                                ))}
                                {/* Líneas dims → subdims */}
                                <line x1="140" y1="215" x2="50" y2="310" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 3" />
                                <line x1="140" y1="215" x2="230" y2="310" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 3" />
                                <line x1="480" y1="215" x2="390" y2="310" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 3" />
                                <line x1="480" y1="215" x2="570" y2="310" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 3" />

                                {/* FACT central */}
                                <g onClick={() => setDimDetalle(null)} style={{ cursor: 'pointer' }}>
                                    <rect x="190" y="30" width="240" height="80" rx="10"
                                        fill="rgba(108,92,231,0.25)" stroke="#6c5ce7" strokeWidth="1.5" />
                                    <text x="310" y="58" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
                                        Fact_Actividad_Usuario
                                    </text>
                                    <text x="310" y="75" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9">
                                        id_actividad · id_usuario · id_examen
                                    </text>
                                    <text x="310" y="90" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">
                                        similitud_texto · cambios_pestana · fallo_biometrico
                                    </text>
                                </g>

                                {/* DIM_TIEMPO */}
                                <g onClick={() => setDimDetalle('tiempo')} style={{ cursor: 'pointer' }}>
                                    <rect x="225" y="165" width="170" height="52" rx="8"
                                        fill={dimDetalle === 'tiempo' ? '#1d9e75' : 'rgba(29,158,117,0.2)'}
                                        stroke="#1d9e75" strokeWidth={dimDetalle === 'tiempo' ? 1.5 : 0.75} />
                                    <text x="310" y="188" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Dim_Tiempo</text>
                                    <text x="310" y="203" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">fecha · semestre · ciclo · turno</text>
                                </g>

                                {/* DIM_USUARIO */}
                                <g onClick={() => setDimDetalle('usuario')} style={{ cursor: 'pointer' }}>
                                    <rect x="50" y="165" width="160" height="52" rx="8"
                                        fill={dimDetalle === 'usuario' ? '#1d9e75' : 'rgba(29,158,117,0.2)'}
                                        stroke="#1d9e75" strokeWidth={dimDetalle === 'usuario' ? 1.5 : 0.75} />
                                    <text x="130" y="188" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Dim_Usuario</text>
                                    <text x="130" y="203" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">nombre · tipo · curso · facultad</text>
                                </g>

                                {/* DIM_EXAMEN */}
                                <g onClick={() => setDimDetalle('examen')} style={{ cursor: 'pointer' }}>
                                    <rect x="400" y="165" width="160" height="52" rx="8"
                                        fill={dimDetalle === 'examen' ? '#1d9e75' : 'rgba(29,158,117,0.2)'}
                                        stroke="#1d9e75" strokeWidth={dimDetalle === 'examen' ? 1.5 : 0.75} />
                                    <text x="480" y="188" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Dim_Examen</text>
                                    <text x="480" y="203" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">nombre · curso · plataforma_lms</text>
                                </g>

                                {/* DIM_INCIDENTE */}
                                <g onClick={() => setDimDetalle('incidente')} style={{ cursor: 'pointer' }}>
                                    <rect x="50" y="265" width="160" height="52" rx="8"
                                        fill={dimDetalle === 'incidente' ? '#d85a30' : 'rgba(216,90,48,0.15)'}
                                        stroke="#d85a30" strokeWidth={dimDetalle === 'incidente' ? 1.5 : 0.5} />
                                    <text x="130" y="288" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Dim_Incidente</text>
                                    <text x="130" y="303" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8">tipo · estado_final · gravedad</text>
                                </g>

                                {/* DIM_DISPOSITIVO */}
                                <g onClick={() => setDimDetalle('dispositivo')} style={{ cursor: 'pointer' }}>
                                    <rect x="225" y="265" width="165" height="52" rx="8"
                                        fill={dimDetalle === 'dispositivo' ? '#d85a30' : 'rgba(216,90,48,0.15)'}
                                        stroke="#d85a30" strokeWidth={dimDetalle === 'dispositivo' ? 1.5 : 0.5} />
                                    <text x="307" y="288" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Dim_Dispositivo</text>
                                    <text x="307" y="303" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8">tipo · SO · navegador</text>
                                </g>

                                {/* DIM_UBICACION */}
                                <g onClick={() => setDimDetalle('ubicacion')} style={{ cursor: 'pointer' }}>
                                    <rect x="400" y="265" width="165" height="52" rx="8"
                                        fill={dimDetalle === 'ubicacion' ? '#d85a30' : 'rgba(216,90,48,0.15)'}
                                        stroke="#d85a30" strokeWidth={dimDetalle === 'ubicacion' ? 1.5 : 0.5} />
                                    <text x="482" y="288" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Dim_Ubicacion</text>
                                    <text x="482" y="303" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8">pais · ciudad · region · zona</text>
                                </g>

                                {/* SUB-DIM Auditor */}
                                <g onClick={() => setDimDetalle('auditor')} style={{ cursor: 'pointer' }}>
                                    <rect x="50" y="360" width="140" height="44" rx="6"
                                        fill="rgba(186,117,23,0.15)" stroke="#ba7517" strokeWidth="0.5" />
                                    <text x="120" y="380" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">Dim_Auditoria</text>
                                    <text x="120" y="394" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">auditor · resolución_final</text>
                                </g>

                                {/* SUB-DIM Carrera */}
                                <g onClick={() => setDimDetalle('carrera')} style={{ cursor: 'pointer' }}>
                                    <rect x="430" y="360" width="140" height="44" rx="6"
                                        fill="rgba(186,117,23,0.15)" stroke="#ba7517" strokeWidth="0.5" />
                                    <text x="500" y="380" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">Dim_Carrera</text>
                                    <text x="500" y="394" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">carrera · facultad · sede</text>
                                </g>

                                {/* Líneas a subdims */}
                                <line x1="130" y1="317" x2="120" y2="360" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
                                <line x1="480" y1="317" x2="500" y2="360" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />

                                {/* Leyenda */}
                                {[
                                    { x: 10, color: '#6c5ce7', label: 'Tabla de hechos' },
                                    { x: 130, color: '#1d9e75', label: 'Dimensión principal' },
                                    { x: 270, color: '#d85a30', label: 'Sub-dimensión' },
                                    { x: 380, color: '#ba7517', label: 'Dimensión auxiliar' },
                                ].map(l => (
                                    <g key={l.label}>
                                        <rect x={l.x} y="408" width="9" height="9" rx="2" fill={l.color} />
                                        <text x={l.x + 13} y="417" fill="rgba(255,255,255,0.35)" fontSize="8">{l.label}</text>
                                    </g>
                                ))}
                            </svg>

                            {/* Panel detalle */}
                            {dimDetalle && (() => {
                                const dim = DIMENSIONES.find(d => d.id === dimDetalle)
                                const extras = {
                                    auditor: { label: 'Dim_Auditoria', campos: ['id_auditoria PK', 'nombre_auditor', 'estado_revision', 'resolucion_final'] },
                                    carrera: { label: 'Dim_Carrera', campos: ['id_carrera PK', 'nombre_carrera', 'facultad', 'sede'] },
                                }
                                const info = dim || extras[dimDetalle]
                                return (
                                    <div className="flex-1 border-l border-surface-border pl-4">
                                        <p className="text-xs text-white/25 uppercase tracking-widest mb-2">Detalle de tabla</p>
                                        <p className="text-sm font-bold text-white mb-3">{info?.label}</p>
                                        <div className="space-y-1.5">
                                            {info?.campos?.map(c => (
                                                <div key={c} className="flex items-center gap-2 bg-white/4 px-3 py-2 rounded-lg">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                                                    <span className="text-xs text-white/65 font-mono">{c}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })()}
                        </div>
                        <p className="text-xs text-white/20 mt-3 text-center">Haz clic en cualquier tabla para ver sus campos detallados</p>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                            <label className="text-xs text-white/40 font-medium block mb-3">
                                Métricas (hechos numéricos) — selecciona las del proyecto
                            </label>
                            <div className="space-y-1.5">
                                {METRICAS.map(m => (
                                    <button key={m.id} type="button" onClick={() => toggleM(m.id)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${metricasSel.includes(m.id)
                                                ? 'bg-teal-600/15 border-teal-600/35' : 'bg-white/3 border-white/8 hover:border-white/18'}`}>
                                        <span className={`text-xs flex-shrink-0 ${metricasSel.includes(m.id) ? 'text-teal-400' : 'text-white/20'}`}>
                                            {metricasSel.includes(m.id) ? '✓' : '+'}
                                        </span>
                                        <div>
                                            <p className={`text-xs font-mono font-semibold ${metricasSel.includes(m.id) ? 'text-teal-300' : 'text-white/55'}`}>{m.label}</p>
                                            <p className="text-xs text-white/20">{m.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                            <label className="text-xs text-white/40 font-medium block mb-3">
                                Dimensiones del modelo — selecciona las activas
                            </label>
                            <div className="space-y-1.5">
                                {DIMENSIONES.map(d => (
                                    <button key={d.id} type="button" onClick={() => toggleD(d.id)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${dimsSel.includes(d.id)
                                                ? 'bg-brand-600/15 border-brand-600/35' : 'bg-white/3 border-white/8 hover:border-white/18'}`}>
                                        <span className={`text-xs flex-shrink-0 ${dimsSel.includes(d.id) ? 'text-brand-400' : 'text-white/20'}`}>
                                            {dimsSel.includes(d.id) ? '✓' : '+'}
                                        </span>
                                        <div>
                                            <p className={`text-xs font-mono font-semibold ${dimsSel.includes(d.id) ? 'text-brand-200' : 'text-white/55'}`}>{d.label}</p>
                                            <p className="text-xs text-white/20">{d.campos.slice(1, 3).join(' · ')}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preguntas del Data Mart del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">
                            Preguntas que responde el Data Mart (del PDF)
                        </p>
                        <div className="space-y-2">
                            {[
                                '¿Qué estudiantes presentan nivel de riesgo "Alto" de fraude basado en su comportamiento?',
                                '¿Cuál es la relación entre el tiempo de permanencia en preguntas y la tasa de aciertos sospechosa?',
                                '¿Qué asignaturas o cursos registran mayor incidencia de alertas por suplantación o plagio?',
                                '¿Cuántas alertas críticas se generan por curso o departamento?',
                                '¿Qué porcentaje de alertas son falsos positivos frente a fraudes confirmados?',
                            ].map((q, i) => (
                                <div key={i} className="flex items-start gap-2 bg-white/4 px-3 py-2.5 rounded-lg">
                                    <span className="text-brand-400 font-bold text-xs flex-shrink-0 mt-0.5">Q{i + 1}</span>
                                    <p className="text-xs text-white/55">{q}</p>
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