import { useModuloStore } from '../../store/useModuloStore'

const CAPA_LABELS = {
    1: 'Fuentes de datos — LMS, Biometría, Similitud',
    2: 'Staging Area / Proceso ETL',
    3: 'Data Warehouse — Modelo Copo de Nieve',
    4: 'Capa de IA — Python Engine, predicción fraude',
    5: 'Capa Semántica — KPIs y reglas de negocio',
    6: 'Analítica avanzada — Módulos ETL + ML',
    7: 'Visualización BI — Power BI Dashboard',
}

export default function Topbar({ modulo }) {
    const { completados } = useModuloStore()
    const pct = Math.round((completados.length / 7) * 100)

    return (
        <div className="flex-shrink-0 border-b border-surface-border bg-surface-card/60">
            <div className="px-6 py-2 border-b border-surface-border/50">
                <p className="text-xs text-white/25 font-medium tracking-wider uppercase">
                    Plataforma Integral de Analítica con BI, Big Data e IA Ética — Detección de Fraude Académico
                </p>
            </div>
            <div className="flex items-center justify-between px-6 py-3">
                <span className="text-xs font-semibold text-brand-400 bg-brand-600/15 border border-brand-600/25 px-2.5 py-1 rounded-lg">
                    Módulo {modulo} · {CAPA_LABELS[modulo]}
                </span>
                <div className="flex items-center gap-3">
                    <div className="w-32 h-1 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-white/30 font-mono">{modulo} / 7</span>
                </div>
            </div>
        </div>
    )
}