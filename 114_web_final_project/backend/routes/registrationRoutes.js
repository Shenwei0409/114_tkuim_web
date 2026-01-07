// registrationRoutes.js
const express = require("express")
const router = express.Router()
const Registration = require("../models/Registration")
const { adminAuth } = require("../middlewares/adminAuth")
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const normalizePhoneDigits = (v) => String(v || "").replace(/\D/g, "")
const isValidTaiwanMobile = (digits) => /^09\d{8}$/.test(digits)

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, agreed } = req.body

    const n = String(name || "").trim()
    const e = String(email || "").trim().toLowerCase()
    const pDigits = String(phone || "").replace(/\D/g, "")

    if (!n) return res.status(400).json({ success: false, message: "name required" })
    if (!e) return res.status(400).json({ success: false, message: "email required" })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return res.status(400).json({ success: false, message: "email invalid" })
    if (!pDigits) return res.status(400).json({ success: false, message: "phone required" })
    if (!/^09\d{8}$/.test(pDigits)) return res.status(400).json({ success: false, message: "phone invalid" })
    if (agreed !== true) return res.status(400).json({ success: false, message: "terms not agreed" })

    const exists = await Registration.findOne({ $or: [{ email: e }, { phone: pDigits }] })
    if (exists) {
      if (exists.email === e) return res.status(409).json({ success: false, message: "email already registered" })
      return res.status(409).json({ success: false, message: "phone already registered" })
    }

    const doc = await Registration.create({ name: n, email: e, phone: pDigits, agreed: true })
    return res.status(201).json({ success: true, data: doc, message: "Registration created" })
  } catch (err) {
    if (err && err.code === 11000) {
      const key = Object.keys(err.keyPattern || err.keyValue || {})[0]
      if (key === "email") return res.status(409).json({ success: false, message: "email already registered" })
      if (key === "phone") return res.status(409).json({ success: false, message: "phone already registered" })
      return res.status(409).json({ success: false, message: "duplicate registration" })
    }
    return res.status(500).json({ success: false, message: err.message })
  }
})


router.get("/", adminAuth, async (req, res) => {
  try {
    const list = await Registration.find().sort({ createdAt: -1 })
    return res.status(200).json({ success: true, data: list, message: "Registrations fetched" })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

router.put("/:id/checkin", adminAuth, async (req, res) => { 
  try {
    const { id } = req.params
    const doc = await Registration.findById(id)
    if (!doc) {
      return res.status(404).json({ success: false, message: "Registration not found" })
    }
    doc.checkedIn = !doc.checkedIn
    await doc.save()
    return res.status(200).json({ success: true, data: doc, message: "Registration updated" })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

router.delete("/:id", adminAuth, async (req, res) => { 
  try {
    const { id } = req.params
    const doc = await Registration.findById(id)
    if (!doc) {
      return res.status(404).json({ success: false, message: "Registration not found" })
    }
    await Registration.deleteOne({ _id: id })
    return res.status(200).json({ success: true, data: { id }, message: "Registration deleted" })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
