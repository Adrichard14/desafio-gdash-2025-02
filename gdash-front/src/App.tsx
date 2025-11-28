import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './index.css'
import { AuthProvider } from "./contexts/authContext"
import { PublicRoute } from "./components/routing/publicRoute"
import { ProtectedRoute } from "./components/routing/protectedRoute"
import LoginPage from "./pages/login"
import DashboardPage from "./pages/dashboard"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas - redireciona se já estiver autenticado */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/register" element={<RegisterPage />} /> */}
          </Route>

          {/* Rotas protegidas - requer autenticação */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
          </Route>

          {/* Rota raiz */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
