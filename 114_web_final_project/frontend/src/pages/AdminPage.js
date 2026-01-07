// AdminPage.js

import { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

const API_URL = "http://localhost:5000/api/registrations"

function AdminPage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const getAdminToken = () => sessionStorage.getItem("adminToken") || ""

  const authHeaders = () => ({
    headers: {
      "x-admin-token": getAdminToken()
    }
  })

  const handleUnauthorized = () => {
    localStorage.removeItem("adminToken")
    navigate("/admin-login", { replace: true })
  }

  const fetchList = useCallback(async () => {
  setLoading(true)
  setError("")
  try {
    const res = await axios.get(API_URL, authHeaders())
    setList(res.data.data)
  } catch (err) {
    if (err?.response?.status === 401) return handleUnauthorized()
    setError(err?.response?.data?.message || "讀取失敗")
  } finally {
    setLoading(false)
  }
}, [])


  useEffect(() => {
    fetchList()
  }, [])

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase()
    if (!k) return list
    return list.filter((x) => `${x.name} ${x.email} ${x.phone}`.toLowerCase().includes(k))
  }, [q, list])

  const toggleCheckin = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/checkin`, {}, authHeaders())
      await fetchList()
    } catch (err) {
      if (err?.response?.status === 401) return handleUnauthorized()
      setError(err?.response?.data?.message || "更新失敗")
    }
  }

  const remove = async (id) => {
    const ok = window.confirm("確定要刪除此報名資料？")
    if (!ok) return
    try {
      await axios.delete(`${API_URL}/${id}`, authHeaders())
      await fetchList()
    } catch (err) {
      if (err?.response?.status === 401) return handleUnauthorized()
      setError(err?.response?.data?.message || "刪除失敗")
    }
  }

  const fmtTime = (iso) => {
    try {
      return new Date(iso).toLocaleString()
    } catch {
      return iso
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "48px 16px",
      background:
        "radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(56,189,248,0.25), transparent 55%), linear-gradient(180deg, #0b1020 0%, #0b1020 60%, #0a0f1c 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    card: {
      width: "min(980px, 100%)",
      borderRadius: 18,
      background: "rgba(255,255,255,0.92)",
      boxShadow: "0 22px 70px rgba(0,0,0,0.35)",
      border: "1px solid rgba(255,255,255,0.35)",
      overflow: "hidden",
      backdropFilter: "blur(6px)"
    },
    top: { height: 6, background: "linear-gradient(90deg, #6366f1, #38bdf8)" },
    body: { padding: 22 },
    title: { margin: 0, fontSize: 26, fontWeight: 900, color: "#0f172a" },
    subtitle: { margin: "8px 0 18px 0", color: "#475569" },
    row: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 14 },
    input: {
      flex: "1 1 260px",
      padding: 12,
      borderRadius: 12,
      border: "1px solid rgba(148,163,184,0.6)",
      background: "rgba(255,255,255,0.9)"
    },
    btn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(148,163,184,0.6)",
      background: "rgba(255,255,255,0.9)",
      cursor: "pointer",
      fontWeight: 900
    },
    tableWrap: {
      overflowX: "auto",
      borderRadius: 14,
      border: "1px solid rgba(148,163,184,0.45)",
      background: "rgba(255,255,255,0.75)"
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: 12, fontSize: 13, color: "#334155", borderBottom: "1px solid rgba(148,163,184,0.35)" },
    td: { padding: 12, borderBottom: "1px solid rgba(148,163,184,0.25)", color: "#0f172a", verticalAlign: "top" },
    pill: (on) => ({
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 999,
      fontWeight: 900,
      fontSize: 12,
      color: on ? "#065f46" : "#7c2d12",
      background: on ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)",
      border: on ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(249,115,22,0.25)"
    }),
    actionBtn: {
      padding: "8px 10px",
      borderRadius: 10,
      border: "1px solid rgba(148,163,184,0.55)",
      background: "rgba(255,255,255,0.9)",
      cursor: "pointer",
      fontWeight: 900,
      marginRight: 8
    },
    dangerBtn: {
      padding: "8px 10px",
      borderRadius: 10,
      border: "1px solid rgba(239,68,68,0.55)",
      background: "rgba(255,255,255,0.9)",
      cursor: "pointer",
      fontWeight: 900,
      color: "#b91c1c"
    },
    error: { marginTop: 10, color: "#ef4444", fontWeight: 900 },
    nav: { display: "flex", gap: 10, marginBottom: 14 },
navBtn: {
  border: "1px solid rgba(148,163,184,0.65)",
  background: "rgba(255,255,255,0.75)",
  borderRadius: 10,
  padding: "8px 10px",
  cursor: "pointer",
  fontWeight: 900,
  color: "#0f172a"
},

  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.top} />
        <div style={styles.body}>
            <div style={styles.nav}>
  <Link to="/register" style={{ textDecoration: "none" }}>
    <button type="button" style={styles.navBtn}>報名表單</button>
  </Link>
  <Link to="/admin" style={{ textDecoration: "none" }}>
    <button type="button" style={styles.navBtn}>名單管理</button>
  </Link>
</div>
          <h1 style={styles.title}>報名名單管理</h1>
          <p style={styles.subtitle}>需要登入才可查看與操作</p>

          <div style={styles.row}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜尋：姓名 / 信箱 / 電話" style={styles.input} />
            <button type="button" onClick={fetchList} style={styles.btn}>
              {loading ? "讀取中..." : "重新整理"}
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>姓名</th>
                  <th style={styles.th}>信箱</th>
                  <th style={styles.th}>電話</th>
                  <th style={styles.th}>報到</th>
                  <th style={styles.th}>報名時間</th>
                  <th style={styles.th}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((x) => (
                  <tr key={x._id}>
                    <td style={styles.td}>{x.name}</td>
                    <td style={styles.td}>{x.email}</td>
                    <td style={styles.td}>{x.phone}</td>
                    <td style={styles.td}>
                      <span style={styles.pill(x.checkedIn)}>{x.checkedIn ? "已報到" : "未報到"}</span>
                    </td>
                    <td style={styles.td}>{fmtTime(x.createdAt)}</td>
                    <td style={styles.td}>
                      <button type="button" style={styles.actionBtn} onClick={() => toggleCheckin(x._id)}>
                        切換報到
                      </button>
                      <button type="button" style={styles.dangerBtn} onClick={() => remove(x._id)}>
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td style={styles.td} colSpan={6}>目前沒有資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
