import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { useModuloStore } from '../store/useModuloStore'

const INTEGRANTES = [
    { nombre: 'Ancajima Sernaque Luis Jerson', orcid: '0009-0002-8052-9547' },
    { nombre: 'Colonia Soto Francesco Daniel', orcid: '0009-0008-6092-3006' },
    { nombre: 'Padilla Trujillo Eric Fernando', orcid: '0009-0003-0275-5319' },
    { nombre: 'Sabogal Buitron Augusto Amadeo', orcid: '0009-0005-2282-3803' },
]

const CAPAS = [
    { n: '01', label: 'Fuentes de datos', desc: 'LMS, Biometría, Similitud, Historial académico' },
    { n: '02', label: 'Staging / ETL', desc: 'Landing Zone, limpieza, ingeniería de variables' },
    { n: '03', label: 'Data Warehouse', desc: 'Modelo copo de nieve — esquema estrella' },
    { n: '04', label: 'Capa IA (Python)', desc: 'Árbol de decisión, predicción de fraude' },
    { n: '05', label: 'Capa semántica / KPIs', desc: 'Medidas, reglas de negocio, catálogos' },
    { n: '06', label: 'Analítica avanzada', desc: 'Módulos ETL simulados, Machine Learning' },
    { n: '07', label: 'Visualización BI', desc: 'Power BI — dashboard ejecutivo interactivo' },
]

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { setUser } = useModuloStore()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) { setError('Completa todos los campos'); return }
        setLoading(true)
        setTimeout(() => {
            setUser('user-1', email.split('@')[0], 'token-demo')
            navigate('/modulo/1')
        }, 800)
    }

    const handleAccesoRapido = (nombre) => {
        const alias = nombre.split(' ').slice(0, 2).join(' ')
        setUser('demo-' + alias, alias, 'token-demo')
        navigate('/modulo/1')
    }

    return (
        <div className="min-h-screen bg-surface flex">

            {/* ── Panel izquierdo ── */}
            <div className="hidden lg:flex w-[52%] flex-col justify-between p-12 border-r border-surface-border bg-surface-card/30">
                <div>
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-white">IntegrityCheck AI</p>
                            <p className="text-xs text-white/30">Universidad César Vallejo · 2026</p>
                        </div>
                    </div>

                    {/* Título del proyecto */}
                    <h1 className="text-2xl font-bold text-white leading-snug mb-2">
                        Plataforma Integral de Analítica<br />
                        con <span className="text-brand-400">BI, Big Data e IA Ética</span>
                    </h1>
                    <p className="text-sm font-medium text-teal-400 mb-1">
                        Para mejorar la detección de fraude académico
                    </p>
                    <p className="text-xs text-white/35 leading-relaxed mb-8">
                        Facultad de Ingeniería y Arquitectura ·
                        Escuela Profesional de Ingeniería de Sistemas ·
                        Línea de Investigación: Apoyo a la reducción de brechas en educación
                    </p>

                    {/* 7 capas */}
                    <div className="space-y-2 mb-10">
                        {CAPAS.map(c => (
                            <div key={c.n} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-md bg-brand-600/30 border border-brand-600/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-brand-200 text-xs font-bold">{c.n}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white/70">{c.label}</p>
                                    <p className="text-xs text-white/25">{c.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Asesor */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4 mb-6">
                        <p className="text-xs text-white/25 uppercase tracking-widest font-semibold mb-1">Asesor</p>
                        <p className="text-sm text-white/60 font-medium">Guevara Jiménez, Jorge Alfredo</p>
                        <p className="text-xs text-white/25 font-mono">ORCID: 0000-0002-8459-9342</p>
                    </div>

                    {/* Integrantes */}
                    <div>
                        <p className="text-xs text-white/25 uppercase tracking-widest font-semibold mb-3">Grupo 4 — Integrantes</p>
                        <div className="space-y-2">
                            {INTEGRANTES.map(i => (
                                <div key={i.orcid} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                                    <span className="text-xs text-white/55">{i.nombre}</span>
                                    <span className="text-xs text-white/20 font-mono ml-auto">{i.orcid}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-xs text-white/15">Lima Norte — Perú · 2026</p>
            </div>

            {/* ── Panel derecho — Login ── */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm">

                    {/* Logo mobile */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-3">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-white">IntegrityCheck AI</h2>
                        <p className="text-xs text-white/35">Detección de Fraude Académico · UCV 2026</p>
                    </div>

                    <div className="bg-surface-card border border-surface-border rounded-2xl p-7">
                        <h2 className="text-lg font-semibold text-white mb-0.5">Iniciar sesión</h2>
                        <p className="text-xs text-white/30 mb-6">Accede con tu cuenta universitaria</p>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs px-3 py-2.5 rounded-xl mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="text-xs text-white/40 font-medium block mb-1.5">Correo institucional</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="usuario@ucv.edu.pe"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20" />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 font-medium block mb-1.5">Contraseña</label>
                                <div className="relative">
                                    <input type={showPass ? 'text' : 'password'} value={password}
                                        onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 pr-10" />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full bg-brand-600 hover:bg-brand-400 text-white font-semibold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {loading ? <><Loader2 size={15} className="animate-spin" />Ingresando...</> : 'Ingresar al sistema'}
                            </button>
                        </form>

                        {/* Acceso rápido */}
                        <div className="mt-5 pt-5 border-t border-surface-border">
                            <p className="text-xs text-white/25 mb-2.5 text-center">Acceso rápido por integrante</p>
                            <div className="space-y-1.5">
                                {INTEGRANTES.map(i => (
                                    <button key={i.orcid} onClick={() => handleAccesoRapido(i.nombre)}
                                        className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg border border-white/8
                            hover:bg-white/5 hover:border-white/18 transition-all group">
                                        <div className="w-5 h-5 rounded-md bg-brand-600/25 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold text-brand-200">{i.nombre.charAt(0)}</span>
                                        </div>
                                        <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">{i.nombre}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}