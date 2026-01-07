// backend/routes/adminRoutes.js
const express = require("express")
const router = express.Router()
const { createAdminToken } = require("../middlewares/adminAuth")

router.post("/login", async (req, res) => {
  const { password } = req.body
  const adminPassword = process.env.ADMIN_PASSWORD || ""

  if (!adminPassword) {
    return res.status(500).json({ success: false, message: "ADMIN_PASSWORD not set" })
  }

  if (String(password || "") !== String(adminPassword)) {
    return res.status(401).json({ success: false, message: "password incorrect" })
  }

  const token = createAdminToken()
  return res.status(200).json({ success: true, data: { token }, message: "login success" })
})

module.exports = router
