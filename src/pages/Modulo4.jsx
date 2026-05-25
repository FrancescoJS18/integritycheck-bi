import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import NavButtons from "../components/layout/NavButtons";
import { useModuloStore } from "../store/useModuloStore";
import { guardarModulo } from "../services/api";

const PREDICCIONES = [
    {
        id: "p1",
        label: "Predicción de Demanda/Pasajeros",
        icon: "👥",
        desc: "Volumen esperado de alumnos en evaluación simultánea",
    },
    {
        id: "p2",
        label: "Predicción de Ingresos",
        icon: "📈",
        desc: "Proyección de efectividad académica por curso",
    },
    {
        id: "p3",
        label: "Predicción Ocupación de Buses",
        icon: "🚌",
        desc: "Carga del sistema LMS por horario de evaluación",
    },
    {
        id: "p4",
        label: "Predicción Tiempo de Espera",
        icon: "⏱️",
        desc: "Latencia esperada en detección de alertas",
    },
];

const MODELOS_ML = [
    {
        id: "dt",
        label: "Decision Tree",
        lib: "sklearn.tree.DecisionTreeClassifier",
        acc: "100%",
        mejor: true,
    },
    {
        id: "rf",
        label: "Random Forest",
        lib: "sklearn.ensemble.RandomForestClassifier",
        acc: "98%",
        mejor: false,
    },
    {
        id: "lr",
        label: "Logistic Regression",
        lib: "sklearn.linear_model.LogisticRegression",
        acc: "87%",
        mejor: false,
    },
    {
        id: "nb",
        label: "Naive Bayes",
        lib: "sklearn.naive_bayes.GaussianNB",
        acc: "82%",
        mejor: false,
    },
];

export default function Modulo4() {
    const { guardarDatos, avanzar } = useModuloStore();
    const [modeloSel, setModeloSel] = useState("dt");
    const [predicSel, setPredicSel] = useState([]);
    const [config, setConfig] = useState({
        profundidad: "4",
        testSize: "0.2",
        randomState: "42",
        umbral: "0.7",
    });
    const [nodoActivo, setNodoActivo] = useState(null);
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const togglePredic = (id) =>
        setPredicSel((p) =>
            p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
        );

    const onNext = async () => {
        setCargando(true);
        try {
            const payload = { modeloSel, predicSel, config };
            await guardarModulo(4, payload).catch(() => { });
            guardarDatos("modulo4", payload);
            avanzar();
            navigate("/modulo/5");
        } finally {
            setCargando(false);
        }
    };

    const NODOS_INFO = {
        raiz: {
            titulo: "Nodo raíz",
            desc: "similitud_texto <= 40.0  |  gini=0.492  |  samples=16  |  class=No Fraude",
        },
        izq: {
            titulo: "Rama izquierda",
            desc: "gini=0.0  |  samples=9  |  value=[9,0]  |  class=No Fraude — estudiante en norma",
        },
        der: {
            titulo: "Rama derecha",
            desc: "gini=0.0  |  samples=7  |  value=[0,7]  |  class=Fraude — derivar a auditoría",
        },
        raiz2: {
            titulo: "Nodo módulo 1",
            desc: "cambios_pestana <= 8.5  |  gini=0.469  |  samples=8  |  class=Fraude",
        },
        izq2: {
            titulo: "Hoja: Normal",
            desc: "gini=0.0  |  samples=3  |  value=[3,0]  |  class=Normal",
        },
        der2: {
            titulo: "Hoja: Fraude",
            desc: "gini=0.0  |  samples=5  |  value=[0,5]  |  class=Fraude confirmado",
        },
    };

    return (
        <div className="flex min-h-screen bg-surface">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar modulo={4} />
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            Capa de IA — Python Engine
                        </h1>
                        <p className="text-sm text-white/40">
                            Capa 4 — Motor de predicción con Machine Learning para detección
                            de fraude en tiempo real
                        </p>
                    </div>

                    {/* Variables de entrada del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">
                            Variables de entrada al modelo (del PDF — Actividad 2)
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                {
                                    var: "similitud_texto",
                                    tipo: "float",
                                    rango: "0-100%",
                                    desc: "% plagio detectado",
                                },
                                {
                                    var: "cambios_pestana",
                                    tipo: "int",
                                    rango: "0-N",
                                    desc: "Pérdidas de foco",
                                },
                                {
                                    var: "duracion_actividad",
                                    tipo: "float",
                                    rango: "min",
                                    desc: "Tiempo total examen",
                                },
                                {
                                    var: "fallo_biometrico",
                                    tipo: "int",
                                    rango: "0 / 1",
                                    desc: "Fallo facial",
                                },
                                {
                                    var: "nivel_sospecha",
                                    tipo: "float",
                                    rango: "0.0-1.0",
                                    desc: "Score de sospecha",
                                },
                                {
                                    var: "intensidad_cambios",
                                    tipo: "float",
                                    rango: "calc.",
                                    desc: "cambios / (tiempo/10)",
                                },
                                {
                                    var: "alerta_fraude",
                                    tipo: "int",
                                    rango: "0 / 1",
                                    desc: "Variable objetivo Y",
                                },
                                {
                                    var: "tiempo_examen_min",
                                    tipo: "float",
                                    rango: "min",
                                    desc: "Contexto velocidad",
                                },
                            ].map((v) => (
                                <div
                                    key={v.var}
                                    className="bg-white/4 border border-white/8 rounded-lg p-2.5"
                                >
                                    <p className="text-xs font-mono font-bold text-brand-200 mb-1 truncate">
                                        {v.var}
                                    </p>
                                    <div className="flex gap-1 mb-1">
                                        <span className="text-xs bg-brand-600/20 text-brand-300 px-1.5 py-0.5 rounded font-mono">
                                            {v.tipo}
                                        </span>
                                        <span className="text-xs bg-white/8 text-white/35 px-1.5 py-0.5 rounded">
                                            {v.rango}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/25">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selección del modelo */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">
                            Modelo de Machine Learning — elige el que usará el sistema
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {MODELOS_ML.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setModeloSel(m.id)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${modeloSel === m.id
                                            ? "bg-brand-600/20 border-brand-600/45"
                                            : "bg-white/3 border-white/8 hover:border-white/18"
                                        }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${modeloSel === m.id ? "bg-brand-600" : "bg-white/8"
                                            }`}
                                    >
                                        <span className="text-white font-bold text-xs">
                                            {m.acc}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p
                                                className={`text-sm font-semibold ${modeloSel === m.id ? "text-brand-100" : "text-white/65"}`}
                                            >
                                                {m.label}
                                            </p>
                                            {m.mejor && (
                                                <span className="text-xs bg-teal-600/25 text-teal-300 px-1.5 py-0.5 rounded-md font-semibold">
                                                    PDF
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-white/25 font-mono truncate">
                                            {m.lib}
                                        </p>
                                    </div>
                                    {modeloSel === m.id && (
                                        <span className="text-teal-400 flex-shrink-0">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hiperparámetros */}
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            {
                                label: "max_depth",
                                key: "profundidad",
                                opts: ["2", "3", "4", "5", "6", "None"],
                            },
                            {
                                label: "test_size",
                                key: "testSize",
                                opts: ["0.2", "0.25", "0.3", "0.15"],
                            },
                            {
                                label: "random_state",
                                key: "randomState",
                                opts: ["42", "0", "7", "21", "100"],
                            },
                            {
                                label: "umbral alerta",
                                key: "umbral",
                                opts: ["0.5", "0.6", "0.7", "0.8", "0.9"],
                            },
                        ].map(({ label, key, opts }) => (
                            <div
                                key={key}
                                className="bg-white/3 border border-surface-border rounded-xl p-3"
                            >
                                <label className="text-xs text-white/35 font-mono block mb-2">
                                    {label}
                                </label>
                                <select
                                    value={config[key]}
                                    onChange={(e) =>
                                        setConfig((p) => ({ ...p, [key]: e.target.value }))
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm text-white/75"
                                >
                                    {opts.map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Árbol de decisiones interactivo del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs text-white/35 font-semibold uppercase tracking-widest">
                                Árbol de decisión — visualización del PDF (haz clic en cada
                                nodo)
                            </p>
                            {nodoActivo && (
                                <div className="bg-surface-card border border-surface-border rounded-lg px-3 py-2 max-w-sm">
                                    <p className="text-xs font-semibold text-brand-200 mb-0.5">
                                        {NODOS_INFO[nodoActivo]?.titulo}
                                    </p>
                                    <p className="text-xs text-white/40 font-mono">
                                        {NODOS_INFO[nodoActivo]?.desc}
                                    </p>
                                </div>
                            )}
                        </div>

                        <svg viewBox="0 0 700 320" className="w-full">
                            {/* Líneas módulo 2 */}
                            <line
                                x1="350"
                                y1="80"
                                x2="175"
                                y2="155"
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="1.5"
                            />
                            <line
                                x1="350"
                                y1="80"
                                x2="525"
                                y2="155"
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="1.5"
                            />
                            <line
                                x1="175"
                                y1="195"
                                x2="90"
                                y2="260"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="1.2"
                            />
                            <line
                                x1="175"
                                y1="195"
                                x2="260"
                                y2="260"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="1.2"
                            />
                            <line
                                x1="525"
                                y1="195"
                                x2="440"
                                y2="260"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="1.2"
                            />
                            <line
                                x1="525"
                                y1="195"
                                x2="610"
                                y2="260"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="1.2"
                            />

                            {/* Labels True/False */}
                            <text x="245" y="133" fill="rgba(255,255,255,0.3)" fontSize="9">
                                True
                            </text>
                            <text x="455" y="133" fill="rgba(255,255,255,0.3)" fontSize="9">
                                False
                            </text>
                            <text x="110" y="237" fill="rgba(255,255,255,0.25)" fontSize="8">
                                True
                            </text>
                            <text x="215" y="237" fill="rgba(255,255,255,0.25)" fontSize="8">
                                False
                            </text>
                            <text x="455" y="237" fill="rgba(255,255,255,0.25)" fontSize="8">
                                True
                            </text>
                            <text x="565" y="237" fill="rgba(255,255,255,0.25)" fontSize="8">
                                False
                            </text>

                            {/* Nodo raíz — similitud_texto */}
                            <g
                                onClick={() =>
                                    setNodoActivo(nodoActivo === "raiz" ? null : "raiz")
                                }
                                style={{ cursor: "pointer" }}
                            >
                                <rect
                                    x="215"
                                    y="20"
                                    width="270"
                                    height="68"
                                    rx="10"
                                    fill={
                                        nodoActivo === "raiz"
                                            ? "rgba(108,92,231,0.45)"
                                            : "rgba(108,92,231,0.2)"
                                    }
                                    stroke="#6c5ce7"
                                    strokeWidth={nodoActivo === "raiz" ? 2 : 1}
                                />
                                <text
                                    x="350"
                                    y="44"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="11"
                                    fontWeight="700"
                                >
                                    similitud_texto &lt;= 40.0
                                </text>
                                <text
                                    x="350"
                                    y="60"
                                    textAnchor="middle"
                                    fill="rgba(255,255,255,0.5)"
                                    fontSize="9"
                                >
                                    gini = 0.492 · samples = 16 · class = No Fraude
                                </text>
                                <text
                                    x="350"
                                    y="76"
                                    textAnchor="middle"
                                    fill="rgba(255,255,255,0.3)"
                                    fontSize="8"
                                >
                                    ← clic para ver detalle
                                </text>
                            </g>

                            {/* Nodo izq — No Fraude */}
                            <g
                                onClick={() =>
                                    setNodoActivo(nodoActivo === "izq" ? null : "izq")
                                }
                                style={{ cursor: "pointer" }}
                            >
                                <rect
                                    x="90"
                                    y="155"
                                    width="170"
                                    height="52"
                                    rx="8"
                                    fill={
                                        nodoActivo === "izq"
                                            ? "rgba(29,158,117,0.5)"
                                            : "rgba(29,158,117,0.2)"
                                    }
                                    stroke="#1d9e75"
                                    strokeWidth={nodoActivo === "izq" ? 2 : 0.75}
                                />
                                <text
                                    x="175"
                                    y="178"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="11"
                                    fontWeight="700"
                                >
                                    ✓ No Fraude
                                </text>
                                <text
                                    x="175"
                                    y="196"
                                    textAnchor="middle"
                                    fill="rgba(255,255,255,0.4)"
                                    fontSize="9"
                                >
                                    gini=0.0 · samples=9 · value=[9,0]
                                </text>
                            </g>

                            {/* Nodo der — cambios_pestana */}
                            <g
                                onClick={() =>
                                    setNodoActivo(nodoActivo === "raiz2" ? null : "raiz2")
                                }
                                style={{ cursor: "pointer" }}
                            >
                                <rect
                                    x="435"
                                    y="155"
                                    width="180"
                                    height="52"
                                    rx="8"
                                    fill={
                                        nodoActivo === "raiz2"
                                            ? "rgba(216,90,48,0.45)"
                                            : "rgba(216,90,48,0.2)"
                                    }
                                    stroke="#d85a30"
                                    strokeWidth={nodoActivo === "raiz2" ? 2 : 0.75}
                                />
                                <text
                                    x="525"
                                    y="176"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="10"
                                    fontWeight="700"
                                >
                                    cambios_pestana &lt;= 8.5
                                </text>
                                <text
                                    x="525"
                                    y="193"
                                    textAnchor="middle"
                                    fill="rgba(255,255,255,0.4)"
                                    fontSize="9"
                                >
                                    gini=0.469 · samples=8
                                </text>
                            </g>

                            {/* Hojas */}
                            {[
                                {
                                    x: 15,
                                    y: 260,
                                    label: "Normal",
                                    color: "rgba(29,158,117,0.3)",
                                    border: "#1d9e75",
                                    key: "izq2",
                                },
                                {
                                    x: 185,
                                    y: 260,
                                    label: "Revisar",
                                    color: "rgba(234,179,8,0.2)",
                                    border: "#ca8a04",
                                    key: "der",
                                },
                                {
                                    x: 355,
                                    y: 260,
                                    label: "Normal",
                                    color: "rgba(29,158,117,0.25)",
                                    border: "#1d9e75",
                                    key: "izq",
                                },
                                {
                                    x: 530,
                                    y: 260,
                                    label: "⚠ Fraude",
                                    color: "rgba(239,68,68,0.25)",
                                    border: "#dc2626",
                                    key: "der2",
                                },
                            ].map((n) => (
                                <g
                                    key={n.key}
                                    onClick={() =>
                                        setNodoActivo(nodoActivo === n.key ? null : n.key)
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    <rect
                                        x={n.x}
                                        y={n.y}
                                        width="140"
                                        height="42"
                                        rx="7"
                                        fill={nodoActivo === n.key ? n.border + "55" : n.color}
                                        stroke={n.border}
                                        strokeWidth={nodoActivo === n.key ? 2 : 0.75}
                                    />
                                    <text
                                        x={n.x + 70}
                                        y={n.y + 26}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="11"
                                        fontWeight="700"
                                    >
                                        {n.label}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>

                    {/* Predicciones del PDF */}
                    <div className="bg-white/3 border border-surface-border rounded-xl p-4">
                        <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">
                            Predicciones que generará el motor IA (del PDF)
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {PREDICCIONES.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => togglePredic(p.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${predicSel.includes(p.id)
                                            ? "bg-brand-600/20 border-brand-600/40"
                                            : "bg-white/3 border-white/8 hover:border-white/18"
                                        }`}
                                >
                                    <span className="text-xl">{p.icon}</span>
                                    <div>
                                        <p
                                            className={`text-xs font-semibold ${predicSel.includes(p.id) ? "text-brand-100" : "text-white/60"}`}
                                        >
                                            {p.label}
                                        </p>
                                        <p className="text-xs text-white/25">{p.desc}</p>
                                    </div>
                                    {predicSel.includes(p.id) && (
                                        <span className="text-teal-400 ml-auto flex-shrink-0 text-xs font-bold">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Justificación del PDF */}
                    <div className="bg-brand-600/8 border border-brand-600/20 rounded-xl p-4">
                        <p className="text-xs text-brand-300 font-semibold mb-2">
                            Justificación IA — del PDF
                        </p>
                        <p className="text-xs text-white/45 leading-relaxed italic">
                            "El árbol de decisiones es completamente transparente y
                            explicable. Un docente o miembro del comité de ética puede
                            entender por qué el sistema activó una alerta (ej: cambios_pestana
                            &gt; 10 y similitud &gt; 40%). En cambio, una red neuronal sería
                            una 'caja negra' que da un resultado sin explicación clara. En un
                            contexto ético como la detección de fraude, la transparencia es
                            fundamental para evitar acusaciones injustas."
                        </p>
                    </div>
                </div>
                <NavButtons onNext={onNext} cargando={cargando} />
            </div>
        </div>
    );
}
