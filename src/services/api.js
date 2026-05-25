import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    const store = JSON.parse(localStorage.getItem('integritycheck-store') || '{}')
    const token = store?.state?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('integritycheck-store')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export const authLogin = (data) => api.post('/auth/login', data)
export const authRegister = (data) => api.post('/auth/register', data)
export const guardarModulo = (n, data) => api.post(`/modulos/${n}`, data)
export const obtenerModulo = (n) => api.get(`/modulos/${n}`)
export const obtenerResumen = () => api.get('/modulos/resumen')

export default api