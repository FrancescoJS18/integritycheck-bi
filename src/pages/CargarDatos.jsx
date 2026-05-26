import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModuloStore } from '../store/useModuloStore'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { Upload, FileText, CheckCircle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'

const COLUMNAS_REQUERIDAS = [
    'nombre', 'email', 'curso', 'similitud_texto',
    'cambios_pestana', 'tiempo_examen', 'fallo_biometrico'
]

const COLUMNAS_OPCIONALES = [
    'facultad', 'carrera', 'ciclo', 'nota', 'nivel_riesgo'
]

export default function CargarDatos() {
    const [archivo, setArchivo] = useState(null)
    const [datos, setDatos] = useState([])
    const [errores, setErrores] = useState([])
    const [procesando, setProcesando] = useState(false)
    const [listo, setListo] = useState(false)
    const [estadisticas, setEstadisticas] = useState(null)
    const [drag, setDrag] = useState(false)
    const { setDatosImportados, setModuloActual } = useModuloStore()
    const navigate = useNavigate()

    const procesarDatos = (filas) => {
        const errs = []
        const columnas = Object.keys(filas[0] || {}).map(c => c.trim().toLowerCase())

        // Verificar columnas requeridas
        COLUMNAS_REQUERIDAS.forEach(col => {
            if (!columnas.includes(col)) {
                errs.push(`Falta columna requerida: "${col}"`)
            }
        })

        if (errs.length > 0) {
            setErrores(errs)
            return
        }

        // Limpiar y normalizar datos
        const datosProcesados = filas
            .filter(f => f.nombre || f.email)
            .map((fila, i) => {
                const similitud = parseFloat(fila.similitud_texto) || 0
                const cambios = parseInt(fila.cambios_pestana) || 0
                const tiempo = parseFloat(fila.tiempo_examen) || 0
                const fallo = parseInt(fila.fallo_biometrico) || 0
                const alerta = similitud > 40 || cambios > 10 || fallo === 1

                let score = 0
                if (similitud > 40) score += 0.4
                if (cambios > 10) score += 0.3
                if (fallo === 1) score += 0.3
                score = parseFloat(score.toFixed(2))

                return {
                    id: i + 1,
                    nombre: fila.nombre?.trim() || `Estudiante ${i + 1}`,
                    email: fila.email?.trim() || `est${i + 1}@ucv.edu.pe`,
                    curso: fila.curso?.trim() || 'Sin curso',
                    similitudTexto: similitud,
                    cambiosPestana: cambios,
                    tiempoExamen: tiempo,
                    fallosBiometrico: fallo,
                    alertaFraude: alerta,
                    scoreNivel: score,
                    nivelRiesgo: score >= 0.7 ? 'Alto' : score >= 0.4 ? 'Medio' : 'Bajo',
                    facultad: fila.facultad?.trim() || 'Sin especificar',
                    carrera: fila.carrera?.trim() || 'Sin especificar',
                    nota: parseFloat(fila.nota) || 0,
                }
            })

        // Estadísticas
        const total = datosProcesados.length
        const fraudes = datosProcesados.filter(d => d.alertaFraude).length
        const alto = datosProcesados.filter(d => d.nivelRiesgo === 'Alto').length
        const medio = datosProcesados.filter(d => d.nivelRiesgo === 'Medio').length
        const bajo = datosProcesados.filter(d => d.nivelRiesgo === 'Bajo').length
        const promSimilitud = (datosProcesados.reduce((a, d) => a + d.similitudTexto, 0) / total).toFixed(1)
        const promCambios = (datosProcesados.reduce((a, d) => a + d.cambiosPestana, 0) / total).toFixed(1)

        setEstadisticas({ total, fraudes, alto, medio, bajo, promSimilitud, promCambios })
        setDatos(datosProcesados)
        setErrores([])
        setListo(true)

        // Guardar en el store para que los módulos lo usen
        setDatosImportados({
  estudiantes: datosProcesados,
  totalRegistros: total,
  fechaCarga: new Date().toISOString(),
  nombreArchivo: archivo?.name || 'datos.csv',
})
    }

    const parsearArchivo = (file) => {
        setProcesando(true)
        setErrores([])
        setListo(false)
        setArchivo(file)

        const ext = file.name.split('.').pop().toLowerCase()

        if (ext === 'csv') {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                transformHeader: h => h.trim().toLowerCase(),
                complete: ({ data }) => {
                    procesarDatos(data)
                    setProcesando(false)
                },
                error: () => {
                    setErrores(['Error al leer el CSV. Verifica el formato.'])
                    setProcesando(false)
                }
            })
        } else if (['xlsx', 'xls'].includes(ext)) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const wb = XLSX.read(e.target.result, { type: 'array' })
                    const ws = wb.Sheets[wb.SheetNames[0]]
                    const data = XLSX.utils.sheet_to_json(ws, { defval: '' })
                    const normalizado = data.map(row => {
                        const nuevo = {}
                        Object.keys(row).forEach(k => { nuevo[k.trim().toLowerCase()] = row[k] })
                        return nuevo
                    })
                    procesarDatos(normalizado)
                } catch {
                    setErrores(['Error al leer el Excel. Verifica el formato.'])
                }
                setProcesando(false)
            }
            reader.readAsArrayBuffer(file)
        } else {
            setErrores(['Formato no soportado. Usa CSV o Excel (.xlsx/.xls)'])
            setProcesando(false)
        }
    }

    const onDrop = useCallback((e) => {
        e.preventDefault()
        setDrag(false)
        const file = e.dataTransfer.files[0]
        if (file) parsearArchivo(file)
    }, [])

    const onFileInput = (e) => {
        const file = e.target.files[0]
        if (file) parsearArchivo(file)
    }

    const handleIniciar = () => {
        setModuloActual(1)
        navigate('/modulo/1')
    }

    return (
        <div className="min-h-screen bg-surface flex">
            {/* Panel izquierdo */}
            <div className="hidden lg:flex w-[42%] flex-col p-10 border-r border-surface-border bg-surface-card/30">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                        <ShieldCheck size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">IntegrityCheck AI</p>
                        <p className="text-xs text-white/30">Detección de Fraude Académico</p>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-3">
                    Carga tu archivo<br />
                    <span className="text-brand-400">de estudiantes</span>
                </h1>
                <p className="text-sm text-white/40 mb-8 leading-relaxed">
                    Sube un CSV o Excel con los datos de tus estudiantes. El sistema procesará
                    automáticamente los 7 módulos de la plataforma BI con esos datos.
                </p>

                {/* Formato requerido */}
                <div className="bg-white/3 border border-surface-border rounded-xl p-4 mb-4">
                    <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">
                        Columnas requeridas
                    </p>
                    <div className="space-y-1.5">
                        {[
                            { col: 'nombre', desc: 'Nombre completo del estudiante' },
                            { col: 'email', desc: 'Correo institucional' },
                            { col: 'curso', desc: 'Asignatura evaluada' },
                            { col: 'similitud_texto', desc: '% similitud con fuentes (0-100)' },
                            { col: 'cambios_pestana', desc: 'Número de cambios de pestaña' },
                            { col: 'tiempo_examen', desc: 'Duración del examen en minutos' },
                            { col: 'fallo_biometrico', desc: '0=OK / 1=fallo facial' },
                        ].map(c => (
                            <div key={c.col} className="flex items-start gap-2">
                                <code className="text-xs bg-brand-600/20 text-brand-200 px-2 py-0.5 rounded font-mono flex-shrink-0">
                                    {c.col}
                                </code>
                                <span className="text-xs text-white/35">{c.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                    <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">
                        Columnas opcionales
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {['facultad', 'carrera', 'ciclo', 'nota', 'nivel_riesgo'].map(c => (
                            <code key={c} className="text-xs bg-white/8 text-white/40 px-2 py-0.5 rounded font-mono">
                                {c}
                            </code>
                        ))}
                    </div>
                </div>
            </div>

            {/* Panel derecho */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-lg">

                    {/* Zona de arrastre */}
                    {!listo && (
                        <div
                            onDragOver={e => { e.preventDefault(); setDrag(true) }}
                            onDragLeave={() => setDrag(false)}
                            onDrop={onDrop}
                            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all mb-4 ${drag
                                    ? 'border-brand-400 bg-brand-600/10'
                                    : 'border-white/15 hover:border-white/25 bg-white/2'
                                }`}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-600/30 flex items-center justify-center mx-auto mb-4">
                                <Upload size={28} className={drag ? 'text-brand-300' : 'text-brand-400'} />
                            </div>
                            <p className="text-white font-semibold mb-1">
                                {procesando ? 'Procesando...' : 'Arrastra tu archivo aquí'}
                            </p>
                            <p className="text-sm text-white/35 mb-4">CSV o Excel (.xlsx) — hasta 10MB</p>

                            <label className="cursor-pointer">
                                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-400 text-white text-sm font-semibold rounded-xl transition-all">
                                    <FileText size={15} /> Seleccionar archivo
                                </span>
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={onFileInput}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}

                    {/* Errores */}
                    {errores.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={16} className="text-red-400" />
                                <p className="text-sm font-semibold text-red-400">Error en el archivo</p>
                            </div>
                            {errores.map((e, i) => (
                                <p key={i} className="text-xs text-red-300 ml-6">{e}</p>
                            ))}
                            <p className="text-xs text-white/30 ml-6 mt-2">
                                Descarga el archivo de ejemplo para ver el formato correcto.
                            </p>
                        </div>
                    )}

                    {/* Resultado exitoso */}
                    {listo && estadisticas && (
                        <div className="space-y-4">
                            {/* Header éxito */}
                            <div className="flex items-center gap-3 bg-teal-600/15 border border-teal-600/30 rounded-xl p-4">
                                <CheckCircle size={20} className="text-teal-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-teal-300">
                                        ¡Archivo cargado correctamente!
                                    </p>
                                    <p className="text-xs text-white/40">{archivo?.name}</p>
                                </div>
                                <button
                                    onClick={() => { setListo(false); setArchivo(null); setDatos([]) }}
                                    className="ml-auto text-xs text-white/30 hover:text-white/60 border border-white/10 px-2 py-1 rounded-lg"
                                >
                                    Cambiar
                                </button>
                            </div>

                            {/* Estadísticas */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/4 border border-surface-border rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-white">{estadisticas.total}</p>
                                    <p className="text-xs text-white/35 mt-1">Total estudiantes</p>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-red-400">{estadisticas.fraudes}</p>
                                    <p className="text-xs text-white/35 mt-1">Con alerta de fraude</p>
                                </div>
                                <div className="bg-white/4 border border-surface-border rounded-xl p-3 text-center">
                                    <div className="flex justify-around">
                                        <div>
                                            <p className="text-lg font-bold text-red-400">{estadisticas.alto}</p>
                                            <p className="text-xs text-white/30">Alto</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-amber-400">{estadisticas.medio}</p>
                                            <p className="text-xs text-white/30">Medio</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-teal-400">{estadisticas.bajo}</p>
                                            <p className="text-xs text-white/30">Bajo</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-white/25 mt-1">Distribución de riesgo</p>
                                </div>
                                <div className="bg-white/4 border border-surface-border rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-brand-400">{estadisticas.promSimilitud}%</p>
                                    <p className="text-xs text-white/30">Similitud promedio</p>
                                    <p className="text-lg font-bold text-brand-400 mt-1">{estadisticas.promCambios}</p>
                                    <p className="text-xs text-white/30">Cambios pestaña promedio</p>
                                </div>
                            </div>

                            {/* Preview tabla */}
                            <div className="bg-white/3 border border-surface-border rounded-xl overflow-hidden">
                                <div className="px-4 py-2.5 border-b border-surface-border flex items-center justify-between">
                                    <p className="text-xs text-white/35 font-semibold">
                                        Vista previa — primeros 5 registros
                                    </p>
                                    <span className="text-xs text-white/20">{estadisticas.total} total</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-surface-border">
                                                {['Nombre', 'Curso', 'Similitud', 'Cambios', 'Riesgo'].map(h => (
                                                    <th key={h} className="text-left px-3 py-2 text-white/30 font-medium">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datos.slice(0, 5).map((d, i) => (
                                                <tr key={i} className="border-b border-surface-border/50">
                                                    <td className="px-3 py-2 text-white/65 truncate max-w-[120px]">{d.nombre}</td>
                                                    <td className="px-3 py-2 text-white/45 truncate max-w-[100px]">{d.curso}</td>
                                                    <td className="px-3 py-2 text-white/65">{d.similitudTexto}%</td>
                                                    <td className="px-3 py-2 text-white/65">{d.cambiosPestana}</td>
                                                    <td className="px-3 py-2">
                                                        <span className={`px-2 py-0.5 rounded-md font-semibold ${d.nivelRiesgo === 'Alto' ? 'bg-red-500/20 text-red-400' :
                                                                d.nivelRiesgo === 'Medio' ? 'bg-amber-500/20 text-amber-400' :
                                                                    'bg-teal-500/20 text-teal-400'
                                                            }`}>
                                                            {d.nivelRiesgo}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Botón iniciar */}
                            <button
                                onClick={handleIniciar}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-400 text-white font-bold rounded-xl transition-all text-sm"
                            >
                                Iniciar los 7 módulos con estos datos
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Link descarga ejemplo */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-white/25 mb-2">¿No tienes un archivo? Descarga el de ejemplo:</p>
                        <button
                            onClick={() => {
                                const csv = `nombre,email,curso,similitud_texto,cambios_pestana,tiempo_examen,fallo_biometrico,facultad,carrera,nota
Juan Pérez García,jperez@ucv.edu.pe,Ética Profesional,85.5,15,20,0,Ingeniería de Sistemas,Ing. de Sistemas,12
María López Torres,mlopez@ucv.edu.pe,Estadística I,12.0,3,55,0,Ingeniería de Sistemas,Ing. de Sistemas,16
Carlos Quispe Mamani,cquispe@ucv.edu.pe,Algoritmos,0,25,30,1,Ingeniería de Sistemas,Ing. de Sistemas,8
Ana Flores Vega,aflores@ucv.edu.pe,Cálculo II,45.2,8,42,0,Ingeniería de Sistemas,Ing. de Sistemas,14
Pedro Ramírez Cruz,pramirez@ucv.edu.pe,Base de Datos,5.0,2,65,0,Ingeniería de Sistemas,Ing. de Sistemas,18`
                                const blob = new Blob([csv], { type: 'text/csv' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url; a.download = 'ejemplo_estudiantes.csv'; a.click()
                            }}
                            className="text-xs text-brand-400 hover:text-brand-200 underline transition-colors"
                        >
                            Descargar ejemplo_estudiantes.csv
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}