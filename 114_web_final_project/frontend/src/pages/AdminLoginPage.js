// frontend/src/pages/AdminLoginPage.js
import { useState } from "react"
import axios from "axios"

const API_URL = "http://localhost:5000/api/admin/login"

function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const login = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await axios.post(API_URL, { password })
      const token = res.data.data.token
      sessionStorage.setItem("adminToken", token)
      window.location.replace("/admin")
    } catch (err) {
      setError(err?.response?.data?.message || "login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "min(420px, 100%)", border: "1px solid rgba(148,163,184,0.6)", borderRadius: 14, padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>管理者登入</h2>
        <form onSubmit={login}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="輸入管理密碼"
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid rgba(148,163,184,0.6)" }}
          />
          {error && <div style={{ color: "#ef4444", fontWeight: 800, marginTop: 10 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading || !password}
            style={{ marginTop: 12, width: "100%", padding: 12, borderRadius: 10, border: "none", cursor: "pointer" }}
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
