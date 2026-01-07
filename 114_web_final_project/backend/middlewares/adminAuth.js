// backend/middlewares/adminAuth.js
const activeTokens = new Set()

const createAdminToken = () => {
  const token = `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`
  activeTokens.add(token)
  return token
}

const adminAuth = (req, res, next) => {
  const token = req.headers["x-admin-token"]
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ success: false, message: "admin unauthorized" })
  }
  next()
}

module.exports = { adminAuth, createAdminToken }
