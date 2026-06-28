import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout/Navbar'
import Dashboard from './pages/Dashboard'
import Proyectos from './pages/Proyectos'
import Capitulos from './pages/Capitulos'
import Documentos from './pages/Documentos'
import MemoriaCalculo from './pages/MemoriaCalculo'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/capitulos" element={<Capitulos />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/memoria" element={<MemoriaCalculo />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
