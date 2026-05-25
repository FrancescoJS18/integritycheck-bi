import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import NavButtons from '../components/layout/NavButtons'
import { useModuloStore } from '../store/useModuloStore'
import { guardarModulo } from '../services/api'

const FUENTES = [
    { id: 'lms', label: 'Logs del LMS', icon: '🖥️', desc: 'Canvas, Moodle, Blackboard — actividad del estudiante' },
    { id: 'biometria', label: 'Biometría', icon: '👤', desc: 'Reconocimiento facial, verificación de identidad' },
    { id: 'similitud', label: 'Similitud de texto', icon: '📄', desc: 'Porcentaje de coincidencia con fuentes externas' },
    { id: 'historial', label: 'Historial académico', icon: '📚', desc: 'Registro de faltas éticas y rendimiento previo' },
    { id: 'keystroke', label: 'Patrones de tecleo', icon: '⌨️', desc: 'Velocidad y cadencia de escritura (keystroke)' },
    { id: 'navegacion', label: 'Navegación / Tab-switch', icon: '🌐', desc: 'Cambios de pestaña y pérdida de foco de ventana' },
]

const DECISIONES = [
    { id: 'd1', label: 'Interrupción automatizada del examen', desc: 'Si nivel crítico de fraude en tiempo real → detener sesión' },
    { id: 'd2', label: 'Activación de protocolo de auditoría', desc: 'Retener actas y exigir validación manual u oral' },
    { id: 'd3', label: 'Rediseño de evaluaciones por asignatura', desc: 'Pasar a casos prácticos en cursos con alta tasa de plagio' },
    { id: 'd4', label: 'Envío de alerta temprana a docentes', desc: 'Notificación inmediata cuando se detecta comportamiento sospechoso' },
]

export default function Modulo1() {
    const { register, handleSubmit } = useForm()
    const { guardarDatos, avanzar } = useModuloStore()
    const [fuentesSel, setFuentesSel] = useState([])
    const [decisionesSel, setDecisionesSel] = useState([])
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    const toggleFuente = (id) => setFuentesSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
    const toggleDecision = (id) => setDecisionesSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

    const onNext = async (data) => {
        setCargando(true)
        try {
            const payload = { ...data, fuentes: fuentesSel, decisiones: decisionesSel }
            await guardarModulo(1, payload).catch(() => { })
            guardarDatos('modulo1', payload)
            avanzar()
            navigate('/modulo/2')
        } finally { setCargando(false) }
    }

    return (
        <div className="flex min-h-screen bg-surface">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar modulo={1} />
                <form className="flex-1 flex flex-col">
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">Fuentes de datos</h1>
                            <p className="text-sm text-white/40">
                                Capa 1 — Define las fuentes de datos del sistema IntegrityCheck AI para detección de fraude académico
                            </p>
                        </div>

                        {/* Info del proyecto */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 bg-white/3 border border-surface-border rounded-xl p-4">
                                <label className="text-xs text-white/40 font-medium block mb-2">Nombre del sistema</label>
                                <input {...register('nombreSistema')}
                                    defaultValue="IntegrityCheck AI — Plataforma Integral de Analítica con BI, Big Data e IA Ética"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/80" />
                            </div>
                            <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                                <label className="text-xs text-white/40 font-medium block mb-2">Institución</label>
                                <input {...register('institucion')} defaultValue="Universidad César Vallejo — Lima Norte"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/80" />
                            </div>
                            <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                                <label className="text-xs text-white/40 font-medium block mb-2">Contexto del problema</label>
                                <select {...register('contexto')}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/75">
                                    <option>Exámenes virtuales — pandemia post-COVID</option>
                                    <option>Evaluaciones presenciales con IA generativa</option>
                                    <option>Trabajos académicos y plagio</option>
                                </select>
                            </div>
                            <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                                <label className="text-xs text-white/40 font-medium block mb-2">Volumen de estudiantes</label>
                                <select {...register('volumen')}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/75">
                                    <option>500 – 1,000 estudiantes</option>
                                    <option>1,000 – 5,000 estudiantes</option>
                                    <option>Más de 5,000 estudiantes</option>
                                </select>
                            </div>
                            <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                                <label className="text-xs text-white/40 font-medium block mb-2">Herramienta de supervisión base</label>
                                <select {...register('herramienta')}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/75">
                                    <option>Google Colab + Python</option>
                                    <option>Inspera (plataforma evaluación)</option>
                                    <option>Talview (proctoring automatizado)</option>
                                    <option>Sistema propio LMS</option>
                                </select>
                            </div>
                        </div>

                        {/* Fuentes de datos */}
                        <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                            <label className="text-xs text-white/40 font-medium block mb-3">
                                Fuentes de datos activas — selecciona todas las que el sistema integrará
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {FUENTES.map(f => (
                                    <button key={f.id} type="button" onClick={() => toggleFuente(f.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${fuentesSel.includes(f.id)
                                                ? 'bg-brand-600/20 border-brand-600/40'
                                                : 'bg-white/3 border-white/8 hover:border-white/18'}`}>
                                        <span className="text-xl">{f.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-semibold ${fuentesSel.includes(f.id) ? 'text-brand-100' : 'text-white/65'}`}>{f.label}</p>
                                            <p className="text-xs text-white/25 leading-tight">{f.desc}</p>
                                        </div>
                                        {fuentesSel.includes(f.id) && <span className="text-teal-400 text-xs font-bold flex-shrink-0">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Datos críticos del PDF */}
                        <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                            <label className="text-xs text-white/40 font-medium block mb-3">
                                Datos críticos que el sistema debe capturar (según PDF)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { campo: 'Coincidencia facial biométrica (%)', desc: 'Verifica identidad del estudiante' },
                                    { campo: 'Tasa de tab-switching', desc: 'Cambios de pestaña por minuto' },
                                    { campo: 'Similitud de texto (%)', desc: 'Plagio de fuentes externas' },
                                    { campo: 'Desviación en velocidad de tecleo', desc: 'Patrón de escritura (keystroke)' },
                                    { campo: 'Historial de faltas éticas', desc: 'Contexto de riesgo del alumno' },
                                    { campo: 'Tiempo del examen (min)', desc: 'Duración y velocidad de respuesta' },
                                ].map(d => (
                                    <div key={d.campo} className="flex items-start gap-2 bg-white/4 px-3 py-2.5 rounded-lg">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-xs font-medium text-white/65">{d.campo}</p>
                                            <p className="text-xs text-white/25">{d.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Decisiones estratégicas */}
                        <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                            <label className="text-xs text-white/40 font-medium block mb-3">
                                Decisiones estratégicas que responderá el sistema
                            </label>
                            <div className="space-y-2">
                                {DECISIONES.map(d => (
                                    <button key={d.id} type="button" onClick={() => toggleDecision(d.id)}
                                        className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl border text-left transition-all ${decisionesSel.includes(d.id)
                                                ? 'bg-teal-600/12 border-teal-600/30'
                                                : 'bg-white/3 border-white/8 hover:border-white/18'}`}>
                                        <span className={`text-sm mt-0.5 flex-shrink-0 ${decisionesSel.includes(d.id) ? 'text-teal-400' : 'text-white/25'}`}>
                                            {decisionesSel.includes(d.id) ? '✓' : '○'}
                                        </span>
                                        <div>
                                            <p className={`text-xs font-semibold ${decisionesSel.includes(d.id) ? 'text-teal-300' : 'text-white/60'}`}>{d.label}</p>
                                            <p className="text-xs text-white/25 mt-0.5">{d.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Problemática del PDF */}
                        <div className="bg-brand-600/8 border border-brand-600/20 rounded-xl p-4">
                            <p className="text-xs text-brand-300 font-semibold mb-2">Problemática central (del PDF)</p>
                            <p className="text-xs text-white/50 leading-relaxed italic">
                                "¿De qué forma el diseño e implementación de una Plataforma Integral de Analítica
                                con BI, Big Data e IA Ética mejora la detección de fraude académico?"
                            </p>
                            <div className="mt-3">
                                <label className="text-xs text-white/35 font-medium block mb-2">Tu análisis de la problemática</label>
                                <textarea {...register('analisis')} rows={2}
                                    placeholder="Describe cómo las fuentes de datos seleccionadas responden a esta problemática..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 resize-none placeholder:text-white/20" />
                            </div>
                        </div>
                    </div>
                    <NavButtons onNext={handleSubmit(onNext)} cargando={cargando} />
                </form>
            </div>
        </div>
    )
}