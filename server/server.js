import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js'
import auth from './routes/authRoutes.js'
import finance from './routes/financeRoutes.js'
import tasks from './routes/taskRoutes.js'

dotenv.config()

await connectDB()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use(morgan('dev'))
app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', auth)
app.use('/api/finance', finance)
app.use('/api/tasks', tasks)
app.use((err, req, res, next) =>
  res.status(500).json({ message: err.message || 'Server error' }),
)
app.listen(process.env.PORT || 5000, () =>
  console.log(`API running on ${process.env.PORT || 5000}`),
)
