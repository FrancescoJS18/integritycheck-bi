import { useNavigate } from 'react-router-dom'
import { useModuloStore } from '../../store/useModuloStore'
import { CheckCircle, Lock, LogOut, ShieldCheck } from 'lucide-react'

const MODULOS = [
    { num: 1, label: 'Fuentes de datos', sub: 'LMS, Biometría, Similitud, Historial' },
    { num: 2, label: 'Staging / ETL', sub: 'Landing Zone, limpieza, variables' },
    { num: 3, label: 'Data Warehouse', sub: 'Modelo copo de nieve' },
    { num: 4, label: 'Capa de IA (Python)', sub: 'Árbol decisión, predicción fraude' },
    { num: 5, label: 'Capa semántica / KPIs', sub: 'Medidas KPI, reglas de negocio' },
    { num: 6, label: 'Analítica avanzada', sub: 'Módulos ETL simulados, ML' },
    { num: 7, label: 'Visualización BI', sub: 'Power BI — dashboard ejecutivo' },
]

export default function Sidebar() {
    const navigate = useNavigate()
    const { completados, moduloActual, userName, logout, setModuloActual } = useModuloStore()

    const handleNav = (num) => {
        const bloqueado = num > moduloActual && !completados.includes(`modulo${num}`)
        if (!bloqueado) { setModuloActual(num); navigate(`/modulo/${num}`) }
    }

    return (
        <aside className="w-64 bg-surface-card border-r border-surface-border flex flex-col min-h-screen flex-shrink-0">
            {/* Logo */}
            <div className="p-5 border-b border-surface-border">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white leading-tight">IntegrityCheck AI</p>
                        <p className="text-xs text-white/30 mt-0.5 leading-tight">Detección de Fraude Académico</p>
                    </div>
                </div>
            </div>

            {/* Progreso */}
            <div className="px-5 py-3 border-b border-surface-border">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-white/30">Progreso general</span>
                    <span className="text-xs font-semibold text-brand-400">{completados.length}/7</span>
                </div>
                <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-700"
                        style={{ width: `${(completados.length / 7) * 100}%` }} />
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 overflow-y-auto">
                <p className="text-xs text-white/25 font-semibold uppercase tracking-widest px-2 mb-3">
                    Capas de la arquitectura BI
                </p>
                <ul className="space-y-0.5">
                    {MODULOS.map(({ num, label, sub }) => {
                        const key = `modulo${num}`
                        const isDone = completados.includes(key)
                        const isActive = moduloActual === num
                        const isLocked = num > moduloActual && !isDone
                        return (
                            <li key={num}>
                                <button onClick={() => handleNav(num)} disabled={isLocked}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                    ${isActive ? 'bg-brand-600/20 border border-brand-600/30' : 'border border-transparent'}
                    ${!isActive && !isLocked ? 'hover:bg-white/4' : ''}
                    ${isLocked ? 'opacity-25 cursor-not-allowed' : ''}
                    ${isDone && !isActive ? 'opacity-55' : ''}`}>
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isDone && !isActive ? 'bg-teal-600' : isActive ? 'bg-brand-600' : 'bg-white/8'}`}>
                                        {isDone && !isActive
                                            ? <CheckCircle size={13} className="text-white" />
                                            : <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-white/30'}`}>{num}</span>}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={`text-xs font-medium truncate ${isActive ? 'text-brand-100' : 'text-white/55'}`}>{label}</p>
                                        <p className="text-xs text-white/20 truncate">{sub}</p>
                                    </div>
                                    {isLocked && <Lock size={10} className="text-white/20 flex-shrink-0" />}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Usuario */}
            <div className="p-3 border-t border-surface-border">
                <div className="flex items-center gap-2 px-2 py-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-600/30 border border-brand-600/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-brand-100">{userName?.charAt(0)?.toUpperCase() || 'G'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/70 truncate">{userName || 'Grupo 4'}</p>
                        <p className="text-xs text-white/25">UCV · Ing. Sistemas 2026</p>
                    </div>
                    <button onClick={() => { logout(); navigate('/login') }}
                        className="text-white/25 hover:text-white/60 transition-colors" title="Cerrar sesión">
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </aside>
    )
}