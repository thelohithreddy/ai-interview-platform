const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')

const app = express()
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({ origin: FRONTEND_URL }))
app.use(express.json())
app.use(authRoutes)

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    port: Number(process.env.PORT) || 5001,
    oauth: {
      google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
      apple: Boolean(process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID),
    },
  })
})

app.get('/', (req, res) => {
  res.send('Backend is running successfully')
})

app.post('/api/ai/interview-question', (req, res) => {
  res.status(501).json({ error: 'AI interview endpoint not implemented yet' })
})

app.post('/api/ai/evaluate-answer', (req, res) => {
  res.status(501).json({ error: 'AI evaluate endpoint not implemented yet' })
})

app.post('/api/ai/recommendations', (req, res) => {
  res.status(501).json({ error: 'AI recommendations endpoint not implemented yet' })
})

app.post('/api/resume/upload', (req, res) => {
  res.status(501).json({ error: 'Resume upload endpoint not implemented yet' })
})

app.post('/api/resume/analyze', (req, res) => {
  res.status(501).json({ error: 'Resume analyze endpoint not implemented yet' })
})

// Default 5001 — macOS AirPlay often blocks port 5000 with HTTP 403
const PORT = Number(process.env.PORT) || 5001

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`)
  console.log(`Health check: http://127.0.0.1:${PORT}/api/health`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Set PORT=5002 in backend/.env and update VITE_API_URL.`)
  } else {
    console.error(err)
  }
  process.exit(1)
})
