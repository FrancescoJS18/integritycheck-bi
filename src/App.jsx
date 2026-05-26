import { Routes, Route, Navigate } from 'react-router-dom'
import Login      from './pages/Login'
import CargarDatos from './pages/CargarDatos'
import Modulo1    from './pages/Modulo1'
import Modulo2    from './pages/Modulo2'
import Modulo3    from './pages/Modulo3'
import Modulo4    from './pages/Modulo4'
import Modulo5    from './pages/Modulo5'
import Modulo6    from './pages/Modulo6'
import Modulo7    from './pages/Modulo7'

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Navigate to="/login" replace />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/cargar"    element={<CargarDatos />} />
      <Route path="/modulo/1"  element={<Modulo1 />} />
      <Route path="/modulo/2"  element={<Modulo2 />} />
      <Route path="/modulo/3"  element={<Modulo3 />} />
      <Route path="/modulo/4"  element={<Modulo4 />} />
      <Route path="/modulo/5"  element={<Modulo5 />} />
      <Route path="/modulo/6"  element={<Modulo6 />} />
      <Route path="/modulo/7"  element={<Modulo7 />} />
      <Route path="*"          element={<Navigate to="/login" replace />} />
    </Routes>
  )
}