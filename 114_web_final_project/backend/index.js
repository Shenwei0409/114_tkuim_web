// index.js
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use("/api/todos", require("./routes/todoRoutes"))
app.use("/api/registrations", require("./routes/registrationRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))

app.get("/", (req, res) => {
  res.send("Hello API")
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error(err.message)
  })
