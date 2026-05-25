import { useNavigate } from 'react-router-dom'
import { useModuloStore } from '../../store/useModuloStore'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

export default function NavButtons({ onNext, cargando = false, textoNext = 'Siguiente' }) {
    const navigate = useNavigate()
    const { moduloActual, retroceder } = useModuloStore()

    const handleBack = () => {
        retroceder()
        navigate(`/modulo/${moduloActual - 1}`)
    }

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-border bg-surface-card flex-shrink-0">
            <button
                type="button"
                onClick={handleBack}
                disabled={moduloActual === 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/45 text-sm
          hover:bg-white/4 hover:text-white/70 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
            >
                <ArrowLeft size={15} /> Anterior
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                    <div key={n} className={`h-1.5 rounded-full transition-all duration-300
            ${n === moduloActual ? 'w-5 bg-brand-400' :
                            n < moduloActual ? 'w-1.5 bg-teal-600' :
                                'w-1.5 bg-white/12'}`}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={onNext}
                disabled={cargando}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-400
            text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95"
            >
                {cargando ? (
                    <><Loader2 size={15} className="animate-spin" /> Guardando...</>
                ) : (
                    <>{textoNext} <ArrowRight size={15} /></>
                )}
            </button>
        </div>
    )
}