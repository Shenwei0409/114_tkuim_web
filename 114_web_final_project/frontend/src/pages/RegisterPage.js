// RegisterPage.js
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const API_URL = "http://localhost:5000/api/registrations"

function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [agree, setAgree] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const emailError = useMemo(() => {
    const v = email.trim()
    if (!v) return "請輸入信箱"
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    return ok ? "" : "信箱格式不正確"
  }, [email])

  const phoneError = useMemo(() => {
    const raw = phone.trim()
    if (!raw) return "請輸入電話號碼"
    const digits = raw.replace(/\D/g, "")
    const ok = /^09\d{8}$/.test(digits)
    return ok ? "" : "電話格式不正確（請輸入 09 開頭共 10 碼）"
  }, [phone])

  const nameError = useMemo(() => {
    const v = name.trim()
    if (!v) return "請輸入姓名"
    return ""
  }, [name])

  const agreeError = useMemo(() => {
    return agree ? "" : "請勾選同意服務條款"
  }, [agree])

  const canSubmit = !nameError && !emailError && !phoneError && !agreeError

  const clearForm = () => {
    setName("")
    setEmail("")
    setPhone("")
    setAgree(false)
    setSubmitted(false)
    setServerError("")
    setSuccessMsg("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setServerError("")
    setSuccessMsg("")
    if (!canSubmit) return

    setLoading(true)
    try {
      await axios.post(API_URL, { name, email, phone, agreed: true })
      setSuccessMsg("報名成功！資料已送出。")
      setName("")
      setEmail("")
      setPhone("")
      setAgree(false)
      setSubmitted(false)
    } catch (err) {
      setServerError(err?.response?.data?.message || "送出失敗")
    } finally {
      setLoading(false)
    }
  }

  const openTermsIfNotAgreed = (e) => {
    if (agree) return
    e.preventDefault()
    setShowTerms(true)
  }

  const closeTerms = () => setShowTerms(false)
  const acceptTerms = () => {
    setAgree(true)
    setShowTerms(false)
  }

  const showNameError = submitted && !!nameError
  const showEmailError = !!emailError && email.length > 0
  const showPhoneError = !!phoneError && phone.length > 0
  const showAgreeError = submitted && !agree

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
      width: "min(560px, 100%)",
      borderRadius: 18,
      background: "rgba(255,255,255,0.92)",
      boxShadow: "0 22px 70px rgba(0,0,0,0.35)",
      border: "1px solid rgba(255,255,255,0.35)",
      overflow: "hidden",
      backdropFilter: "blur(6px)"
    },
    cardTop: { height: 6, background: "linear-gradient(90deg, #6366f1, #38bdf8)" },
    body: { padding: 22 },
    title: { margin: 0, fontSize: 26, fontWeight: 800, color: "#0f172a" },
    subtitle: { margin: "8px 0 18px 0", color: "#475569", lineHeight: 1.6 },
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
    field: { marginBottom: 14 },
    labelRow: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
    label: { fontSize: 14, fontWeight: 700, color: "#0f172a" },
    hint: { fontSize: 12, color: "#64748b" },
    input: (hasError) => ({
      width: "100%",
      padding: "12px 12px",
      borderRadius: 12,
      border: hasError ? "1px solid rgba(239,68,68,0.9)" : "1px solid rgba(148,163,184,0.6)",
      background: "rgba(255,255,255,0.9)",
      outline: "none",
      fontSize: 14
    }),
    error: { marginTop: 8, fontSize: 13, color: "#ef4444", fontWeight: 700 },
    ok: { marginTop: 10, fontSize: 13, color: "#16a34a", fontWeight: 900 },
    termsRow: (hasError) => ({
      marginTop: 6,
      marginBottom: 12,
      padding: "12px 12px",
      borderRadius: 12,
      border: hasError ? "1px solid rgba(239,68,68,0.9)" : "1px solid rgba(148,163,184,0.45)",
      background: "rgba(248,250,252,0.9)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10
    }),
    termsLeft: { display: "flex", gap: 10, alignItems: "center" },
    checkbox: { width: 18, height: 18, accentColor: "#6366f1", cursor: "pointer" },
    termsText: { color: "#0f172a", fontSize: 14, fontWeight: 700 },
    termsLink: { border: "none", background: "transparent", color: "#6366f1", fontWeight: 800, cursor: "pointer", padding: 0, fontSize: 13 },
    primaryBtn: (disabled) => ({
      width: "100%",
      padding: "12px 14px",
      borderRadius: 12,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      background: disabled
        ? "linear-gradient(90deg, rgba(99,102,241,0.45), rgba(56,189,248,0.35))"
        : "linear-gradient(90deg, #6366f1, #38bdf8)",
      color: "#fff",
      fontSize: 15,
      fontWeight: 900,
      marginTop: 8,
      marginBottom: 10
    }),
    secondaryBtn: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid rgba(148,163,184,0.6)",
      background: "rgba(255,255,255,0.95)",
      cursor: "pointer",
      fontSize: 15,
      fontWeight: 900,
      color: "#0f172a"
    },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(2,6,23,0.62)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      zIndex: 50
    },
    modal: {
      width: "min(760px, 100%)",
      borderRadius: 18,
      background: "rgba(255,255,255,0.98)",
      boxShadow: "0 28px 90px rgba(0,0,0,0.45)",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.35)"
    },
    modalTop: { height: 5, background: "linear-gradient(90deg, #6366f1, #38bdf8)" },
    modalHeader: { padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between" },
    modalTitle: { margin: 0, fontSize: 22, fontWeight: 900, color: "#0f172a" },
    closeBtn: { border: "none", background: "transparent", fontSize: 24, cursor: "pointer", color: "#334155", lineHeight: 1 },
    modalBody: { padding: "0 18px 14px 18px", maxHeight: "52vh", overflow: "auto", color: "#0f172a", lineHeight: 1.75 },
    modalActions: { padding: 18, display: "flex", gap: 12, alignItems: "center" },
    modalAgree: {
      padding: "10px 18px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      background: "linear-gradient(90deg, #6366f1, #38bdf8)",
      color: "#fff",
      fontWeight: 900
    },
    modalCancel: {
      padding: "10px 18px",
      borderRadius: 12,
      border: "1px solid rgba(148,163,184,0.6)",
      background: "#fff",
      cursor: "pointer",
      color: "#0f172a",
      fontWeight: 900
    },
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
        <div style={styles.cardTop} />
        <div style={styles.body}>
            <div style={styles.nav}>
  <Link to="/register" style={{ textDecoration: "none" }}>
    <button type="button" style={styles.navBtn}>報名表單</button>
  </Link>
  <Link to="/admin" style={{ textDecoration: "none" }}>
    <button type="button" style={styles.navBtn}>名單管理</button>
  </Link>
</div>

          <h1 style={styles.title}>活動報名表單</h1>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <div style={styles.labelRow}>
                <div style={styles.label}>姓名</div>
                <div style={styles.hint}>必填</div>
              </div>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="請輸入姓名" style={styles.input(showNameError)} />
              {showNameError && <div style={styles.error}>{nameError}</div>}
            </div>

            <div style={styles.field}>
              <div style={styles.labelRow}>
                <div style={styles.label}>信箱</div>
                <div style={styles.hint}>必填</div>
              </div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" style={styles.input(showEmailError)} />
              {showEmailError && <div style={styles.error}>{emailError}</div>}
            </div>

            <div style={styles.field}>
              <div style={styles.labelRow}>
                <div style={styles.label}>電話號碼</div>
                <div style={styles.hint}>必填</div>
              </div>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" style={styles.input(showPhoneError)} />
              {showPhoneError && <div style={styles.error}>{phoneError}</div>}
            </div>

            <div style={styles.termsRow(showAgreeError)}>
              <div style={styles.termsLeft}>
                <input
                  type="checkbox"
                  checked={agree}
                  style={styles.checkbox}
                  onClick={openTermsIfNotAgreed}
                  onChange={(e) => {
                    if (agree) setAgree(e.target.checked)
                  }}
                />
                <div style={styles.termsText}>我已閱讀並同意服務條款</div>
              </div>
              <button type="button" style={styles.termsLink} onClick={() => setShowTerms(true)}>查看條款</button>
            </div>
            {showAgreeError && <div style={styles.error}>{agreeError}</div>}

            {serverError && <div style={styles.error}>{serverError}</div>}
            {successMsg && <div style={styles.ok}>{successMsg}</div>}

            <button type="submit" disabled={!canSubmit || loading} style={styles.primaryBtn(!canSubmit || loading)}>
              {loading ? "送出中..." : "送出報名"}
            </button>

            <button type="button" onClick={clearForm} style={styles.secondaryBtn}>
              清除表單
            </button>
          </form>
        </div>
      </div>

      {showTerms && (
        <div style={styles.overlay} onClick={closeTerms}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTop} />
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>隱私條款</h2>
              <button type="button" style={styles.closeBtn} onClick={closeTerms}>×</button>
            </div>

            <div style={styles.modalBody}>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>服務條款摘要</div>
              <div style={{ marginBottom: 10 }}>1. 本表單僅用於活動報名與聯絡通知。</div>
              <div style={{ marginBottom: 10 }}>2. 你提供的姓名、信箱、電話僅供本次活動使用，不會提供給第三方。</div>
              <div style={{ marginBottom: 10 }}>3. 你可於活動結束前要求刪除你的報名資料。</div>
              <div style={{ marginBottom: 10 }}>4. 送出前請確認資料正確；如需修改請聯絡主辦單位。</div>
            </div>

            <div style={styles.modalActions}>
              <button type="button" style={styles.modalAgree} onClick={acceptTerms}>我同意</button>
              <button type="button" style={styles.modalCancel} onClick={closeTerms}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegisterPage
