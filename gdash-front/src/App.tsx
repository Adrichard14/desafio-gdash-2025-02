import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './index.css'
import { AuthProvider } from "./contexts/authContext"
import { PublicRoute } from "./components/routing/publicRoute"
import { ProtectedRoute } from "./components/routing/protectedRoute"
import LoginPage from "./pages/login"
import DashboardPage from "./pages/dashboard"
import HistoricPage from "./pages/historic"
import RegisterPage from './pages/register'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/historic" element={<HistoricPage />} />
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
