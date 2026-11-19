import Database from 'better-sqlite3'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const databasePath = path.resolve(process.env.DATABASE_PATH || path.join(root, 'data', 'novara.sqlite'))
mkdirSync(path.dirname(databasePath), { recursive: true })

const database = new Database(databasePath)
database.pragma('journal_mode = WAL')
database.pragma('foreign_keys = ON')
database.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    property_name TEXT NOT NULL,
    plot_number TEXT,
    visit_date TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )
`)

const insertEnquiry = database.prepare(`
  INSERT INTO enquiries (name, phone, email, property_name, plot_number, visit_date, message)
  VALUES (@name, @phone, @email, @propertyName, @plotNumber, @visitDate, @message)
`)

const app = express()
app.disable('x-powered-by')
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      upgradeInsecureRequests: null
    }
  }
}))
app.use(express.json({ limit: '16kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.post('/api/enquiries', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many enquiries. Please try again later.' }
}), (request, response) => {
  const body = request.body
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    response.status(400).json({ error: 'Please submit a valid enquiry.' })
    return
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const propertyName = typeof body.propertyName === 'string' ? body.propertyName.trim() : ''
  const plotNumber = typeof body.plotNumber === 'string' ? body.plotNumber.trim() : ''
  const visitDate = typeof body.visitDate === 'string' ? body.visitDate.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const phoneDigits = phone.replace(/\D/g, '')
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validPhone = /^[+()\d\s.-]+$/.test(phone) && phoneDigits.length >= 10 && phone.length <= 30
  const validVisitDate = !visitDate || (
    /^\d{4}-\d{2}-\d{2}$/.test(visitDate) &&
    !Number.isNaN(Date.parse(`${visitDate}T00:00:00Z`)) &&
    new Date(`${visitDate}T00:00:00Z`).toISOString().slice(0, 10) === visitDate
  )

  if (
    name.length < 2 || name.length > 100 ||
    !validPhone ||
    !validEmail || email.length > 254 ||
    propertyName.length < 2 || propertyName.length > 160 ||
    plotNumber.length > 32 ||
    !validVisitDate ||
    message.length < 2 || message.length > 2000
  ) {
    response.status(400).json({ error: 'Please check the enquiry details and try again.' })
    return
  }

  try {
    const result = insertEnquiry.run({
      name,
      phone,
      email,
      propertyName,
      plotNumber: plotNumber || null,
      visitDate: visitDate || null,
      message
    })
    response.status(201).json({ id: Number(result.lastInsertRowid), message: 'Enquiry received.' })
  } catch (error) {
    console.error('Unable to store an enquiry:', error)
    response.status(500).json({ error: 'We could not save your enquiry. Please try again.' })
  }
})

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API route not found.' })
})

app.use(express.static(path.join(root, 'dist')))
app.get('*path', (_request, response, next) => {
  response.sendFile(path.join(root, 'dist', 'index.html'), error => {
    if (error) next()
  })
})

app.use((error, _request, response, _next) => {
  if (error?.type === 'entity.parse.failed') {
    response.status(400).json({ error: 'Please submit valid JSON.' })
    return
  }
  if (error?.type === 'entity.too.large') {
    response.status(413).json({ error: 'The enquiry is too large.' })
    return
  }
  console.error('Unexpected API error:', error)
  response.status(500).json({ error: 'An unexpected server error occurred.' })
})

const port = Number(process.env.PORT || 3001)
const host = process.env.HOST || '127.0.0.1'
app.listen(port, host, () => {
  console.log(`NOVARA API listening at http://${host}:${port}`)
  console.log(`SQLite database: ${databasePath}`)
})
