require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── Uploads folder ──────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// ── Multer ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    /jpeg|jpg|png|gif/.test(path.extname(file.originalname).toLowerCase()) ? cb(null, true) : cb(new Error('Only images allowed'));
  },
});
app.use((req, res, next) => { req.upload = upload; next(); });

// ── Routes ──────────────────────────────────────────────
app.use('/api/students',   require('./backend/routes/studentRoutes'));
app.use('/api/auth',       require('./backend/routes/authRoutes'));
app.use('/api/dashboard',  require('./backend/routes/dashboardRoutes'));
app.use('/api/marks',      require('./backend/routes/marksRoutes'));
app.use('/api/attendance', require('./backend/routes/attendanceRoutes'));
app.use('/api/fees',       require('./backend/routes/feeRoutes'));

// ── Health check ────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: '✅ Server is running', routes: ['/students', '/api/auth', '/api/dashboard', '/api/marks', '/api/attendance', '/api/fees'] }));

// ── 404 ─────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` }));

// ── Error handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// ── MongoDB ──────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// ── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📋 Routes: /students | /api/auth | /api/dashboard | /api/marks | /api/attendance | /api/fees');
});
