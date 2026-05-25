import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useModuloStore = create(
    persist(
        (set, get) => ({
            userId: null,
            userName: '',
            token: null,
            moduloActual: 1,
            completados: [],
            datos: {
                modulo1: {}, modulo2: {}, modulo3: {},
                modulo4: {}, modulo5: {}, modulo6: {}, modulo7: {},
            },

            setUser: (id, name, token) => set({ userId: id, userName: name, token }),

            guardarDatos: (modulo, data) =>
                set((state) => ({
                    datos: { ...state.datos, [modulo]: data },
                    completados: state.completados.includes(modulo)
                        ? state.completados
                        : [...state.completados, modulo],
                })),

            setModuloActual: (n) => set({ moduloActual: n }),

            avanzar: () =>
                set((state) => ({ moduloActual: Math.min(state.moduloActual + 1, 7) })),

            retroceder: () =>
                set((state) => ({ moduloActual: Math.max(state.moduloActual - 1, 1) })),

            logout: () => set({
                userId: null, userName: '', token: null,
                moduloActual: 1, completados: [],
                datos: { modulo1: {}, modulo2: {}, modulo3: {}, modulo4: {}, modulo5: {}, modulo6: {}, modulo7: {} },
            }),
        }),
        { name: 'integritycheck-store' }
    )
)