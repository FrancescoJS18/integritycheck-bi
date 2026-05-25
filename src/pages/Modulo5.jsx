import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import NavButtons from '../components/layout/NavButtons'
import { useModuloStore } from '../store/useModuloStore'
import { guardarModulo } from '../services/api'

const KPIS_PDF = [
    { id: 'k1', perspectiva: 'Académica', nombre: 'Tasa de exámenes sospechosos', formula: '(Exámenes con alerta roja / Total exámenes) × 100', frecuencia: 'Semanal', meta: '≤ 10%', tipo: 'Descriptivo' },
    { id: 'k2', perspectiva: 'Académica', nombre: 'Índice de similitud promedio', formula: 'Promedio de % similitud por examen', frecuencia: 'Mensual', meta: '≤ 20%', tipo: 'Descriptivo' },
    { id: 'k3', perspectiva: 'Estudiantil', nombre: 'Tasa de reincidencia en faltas', formula: '(Estudiantes con 2+ faltas / Total faltosos) × 100', frecuencia: 'Semestral', meta: '≤ 15%', tipo: 'Diagnóstico' },
    { id: 'k4', perspectiva: 'Operativa', nombre: 'Tiempo medio de detección', formula: 'Suma de tiempos de detección / N° alertas', frecuencia: 'Semanal', meta: '≤ 5 seg', tipo: 'Estratégico' },
    { id: 'k5', perspectiva: 'Operativa', nombre: 'Tasa de falsos positivos', formula: '(Alertas descartadas / Total alertas biométricas) × 100', frecuencia: 'Mensual', meta: '≤ 5%', tipo: 'Diagnóstico' },
    { id: 'k6', perspectiva: 'Analítica', nombre: 'Índice de riesgo por alumno', formula: 'Probabilidad generada por modelo IA (0 a 1)', frecuencia: 'Tiempo real', meta: '> 0.7 = alerta roja', tipo: 'Predictivo' },
    { id: 'k7', perspectiva: 'Analítica', nombre: 'Precisión del modelo de detección', formula: '(Predicciones correctas / Total predicciones) × 100', frecuencia: 'Mensual', meta: '≥ 90%', tipo: 'Predictivo' },
    { id: 'k8', perspectiva: 'Financiera', nombre: 'Ahorro por reducción de auditorías', formula: '(Horas auditoría antes - después) × costo/hora', frecuencia: 'Semestral', meta: '+25%', tipo: 'Estratégico' },
]

const COLORES_PERSPECTIVA = {
    'Académica': 'bg-brand-600/20 text-brand-200 border-brand-600/30',
    'Estudiantil': 'bg-teal-600/20 text-teal-300 border-teal-600/30',
    'Operativa': 'bg-amber-600/20 text-amber-300 border-amber-600/30',
    'Analítica': 'bg-purple-600/20 text-purple-300 border-purple-600/30',
    'Financiera': 'bg-green-600/20 text-green-300 border-green-600/30',
}

const COLORES_TIPO = {
    'Descriptivo': 'text-blue-400',
    'Diagnóstico': 'text-amber-400',
    'Predictivo': 'text-purple-400',
    'Estratégico': 'text-teal-400',
}

const PREGUNTAS_ANALITICAS = [
    { n: 1, tipo: 'Descriptiva', q: '¿Cuál es la tasa promedio de alertas de fraude por curso y facultad?' },
    { n: 2, tipo: 'Descriptiva', q: '¿Qué porcentaje de estudiantes presenta comportamientos sospechosos?' },
    { n: 3, tipo: 'Descriptiva', q: '¿Cuál es la tendencia mensual del uso de cambios de pestaña?' },
    { n: 4, tipo: 'Diagnóstica', q: '¿Por qué los estudiantes con alta similitud de texto también presentan más cambios de pestaña?' },
    { n: 5, tipo: 'Diagnóstica', q: '¿Qué relación existe entre el tiempo del examen y el nivel de riesgo detectado?' },
    { n: 6, tipo: 'Diagnóstica', q: '¿Cuáles son los factores que influyen en la generación de falsos positivos?' },
    { n: 7, tipo: 'Predictiva', q: '¿Qué estudiantes tienen mayor probabilidad de clasificarse con "Riesgo Alto"?' },
    { n: 8, tipo: 'Predictiva', q: '¿Cuál es el impacto proyectado del árbol de decisión en reducir auditorías manuales?' },
    { n: 9, tipo: 'Prescriptiva', q: '¿Qué cursos deben priorizarse para rediseñar evaluaciones por alta incidencia de fraude?' },
    { n: 10, tipo: 'Prescriptiva', q: '¿Cómo optimizar la asignación de auditorías para reducir el tiempo de revisión?' },
]

const COLORES_PREGUNTA = {
    'Descriptiva': 'bg-blue-600/15 border-blue-600/30 text-blue-300',
    'Diagnóstica': 'bg-amber-600/15 border-amber-600/30 text-amber-300',
    'Predictiva': 'bg-purple-600/15 border-purple-600/30 text-purple-300',
    'Prescriptiva': 'bg-green-600/15 border-green-600/30 text-green-300',
}

export default function Modulo5() {
    const { guardarDatos, avanzar } = useModuloStore()
    const [kpis, setKpis] = useState(KPIS_PDF)
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    const updateKpi = (id, field, value) =>
        setKpis(p => p.map(k => k.id === id ? { ...k, [field]: value } : k))

    const onNext = async () => {
        setCargando(true)
        try {
            await guardarModulo(5, { kpis }).catch(() => { })
            guardarDatos('modulo5', { kpis })
            avanzar(); navigate('/modulo/6')
        } finally { setCargando(false) }
    }

    return (
        <div className="flex min-h-screen bg-surface">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar modulo={5} />
                <div className="flex-1 p-6 overflow-y-auto space-y-5">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Capa semántica / KPIs</h1>
                        <p className="text-sm text-white/40">
                            Capa 5 — Indicadores clave de rendimiento definidos en el PDF por perspectiva y tipo analítico
                        </p>
                    </div>

                    {/* Tabla de KPIs del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
                            <p className="text-xs text-white/35 font-semibold uppercase tracking-widest">
                                KPIs del sistema — Actividad 3 (Sesión 3 del PDF)
                            </p>
                            <span className="text-xs text-white/25">{kpis.length} indicadores</span>
                        </div>
                        <div className="divide-y divide-surface-border">
                            {kpis.map(k => (
                                <div key={k.id} className="p-4">
                                    <div className="flex items-start gap-3 mb-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold flex-shrink-0 ${COLORES_PERSPECTIVA[k.perspectiva]}`}>
                                            {k.perspectiva}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <input value={k.nombre}
                                                onChange={e => updateKpi(k.id, 'nombre', e.target.value)}
                                                className="w-full bg-transparent text-sm font-semibold text-white/80 border-b border-transparent hover:border-white/15 focus:border-brand-400 pb-0.5 outline-none transition-colors" />
                                        </div>
                                        <span className={`text-xs font-semibold flex-shrink-0 ${COLORES_TIPO[k.tipo]}`}>{k.tipo}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 ml-0">
                                        <div className="col-span-2">
                                            <label className="text-xs text-white/25 block mb-1">Fórmula</label>
                                            <input value={k.formula}
                                                onChange={e => updateKpi(k.id, 'formula', e.target.value)}
                                                className="w-full bg-white/4 border border-white/8 rounded-lg px-2.5 py-1.5 text-xs text-white/60 font-mono outline-none focus:border-brand-400" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-white/25 block mb-1">Frecuencia</label>
                                                <select value={k.frecuencia} onChange={e => updateKpi(k.id, 'frecuencia', e.target.value)}
                                                    className="w-full bg-white/4 border border-white/8 rounded-lg px-2 py-1.5 text-xs text-white/60 outline-none">
                                                    {['Tiempo real', 'Semanal', 'Mensual', 'Semestral'].map(o => <option key={o}>{o}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs text-white/25 block mb-1">Meta</label>
                                                <input value={k.meta} onChange={e => updateKpi(k.id, 'meta', e.target.value)}
                                                    className="w-full bg-white/4 border border-white/8 rounded-lg px-2 py-1.5 text-xs text-white/60 outline-none focus:border-brand-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Medidas API del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">
                            Medidas API — según el PDF (Capa semántica)
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Total Pasajeros', formula: 'SUM(cantidad_tab_switch)', tipo: 'SUM' },
                                { label: 'Ingresos Totales', formula: 'COUNT(alerta_fraude)', tipo: 'COUNT' },
                                { label: 'Tiempo Promedio Examen', formula: 'AVG(tiempo_examen_min)', tipo: 'AVG' },
                                { label: 'Ocupación Promedio', formula: 'AVG(nivel_sospecha_score)', tipo: 'AVG' },
                                { label: 'Viajes por Ruta', formula: 'COUNT(id_actividad) GROUP BY id_curso', tipo: 'GROUP' },
                                { label: 'Tasa Fraude Confirmado', formula: 'SUM(fraude=1)/COUNT(*)*100', tipo: 'CALC' },
                            ].map(m => (
                                <div key={m.label} className="bg-white/4 border border-white/8 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs bg-teal-600/25 text-teal-300 px-1.5 py-0.5 rounded font-mono font-bold">{m.tipo}</span>
                                    </div>
                                    <p className="text-xs font-semibold text-white/70 mb-1">{m.label}</p>
                                    <p className="text-xs text-white/30 font-mono">{m.formula}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preguntas analíticas del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">
                            Preguntas analíticas — Actividad 2, Sesión 3 del PDF
                        </p>
                        <div className="space-y-2">
                            {PREGUNTAS_ANALITICAS.map(p => (
                                <div key={p.n} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${COLORES_PREGUNTA[p.tipo]}`}>
                                    <span className="text-xs font-bold flex-shrink-0 mt-0.5">Q{p.n}</span>
                                    <p className="text-xs flex-1">{p.q}</p>
                                    <span className="text-xs font-semibold flex-shrink-0 opacity-70">{p.tipo}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reglas de negocio */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">
                            Catálogos y reglas de negocio
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { titulo: 'Catálogo de tipos de alerta', items: ['Biometría / Facial', 'Tab-switching', 'Similitud de texto', 'Velocidad de tecleo', 'Reincidencia'] },
                                { titulo: 'Catálogo de resoluciones', items: ['Fraude Confirmado', 'Falso Positivo', 'Advertencia', 'En revisión', 'Archivado'] },
                                { titulo: 'Reglas de clasificación de riesgo', items: ['≥ 0.7 → Riesgo Alto (🔴)', '0.4 - 0.7 → Medio (🟡)', '< 0.4 → Bajo (🟢)', 'Biometría falla → Alto', 'Reincidente → +0.2 score'] },
                            ].map(c => (
                                <div key={c.titulo} className="bg-white/4 border border-white/8 rounded-xl p-3">
                                    <p className="text-xs font-semibold text-white/55 mb-2">{c.titulo}</p>
                                    <ul className="space-y-1">
                                        {c.items.map(it => (
                                            <li key={it} className="flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-brand-400 flex-shrink-0" />
                                                <span className="text-xs text-white/40">{it}</span>
                                            </li>
                                        ))}
                                    </ul>
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