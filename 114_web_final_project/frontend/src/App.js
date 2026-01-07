// frontend/src/App.js
import { Navigate, Route, Routes } from "react-router-dom"
import RegisterPage from "./pages/RegisterPage"
import AdminPage from "./pages/AdminPage"
import AdminLoginPage from "./pages/AdminLoginPage"

const hasToken = () => !!sessionStorage.getItem("adminToken")

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/admin" element={hasToken() ? <AdminPage /> : <Navigate to="/admin-login" replace />} />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  )
}

export default App
