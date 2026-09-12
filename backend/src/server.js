import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { mailRouter } from './routes/mail.js'

const app = express()
const PORT = process.env.PORT || 5000
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', mailRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Attendly backend listening on http://localhost:${PORT}`)
})
