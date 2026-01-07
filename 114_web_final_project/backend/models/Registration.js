// Registration.js
const mongoose = require("mongoose")

const RegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  agreed: { type: Boolean, default: false },
  checkedIn: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

RegistrationSchema.index({ email: 1 }, { unique: true })
RegistrationSchema.index({ phone: 1 }, { unique: true })

module.exports = mongoose.model("Registration", RegistrationSchema)
