require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const studentRoutes   = require('./routes/studentRoutes');
const authRoutes      = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const marksRoutes     = require('./routes/marksRoutes');
const attendanceRoutes= require('./routes/attendanceRoutes');
const feeRoutes       = require('./routes/feeRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: true, // Dynamically allow the requesting origin
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Create uploads folder if not exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files
app.use("/uploads", express.static("uploads"));

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Make upload middleware available globally before routes
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

app.use('/api/students',  studentRoutes);
console.log('✅ Student routes mounted');
app.use('/api/auth',      authRoutes);
console.log('✅ Auth routes mounted');
app.use('/api/dashboard', dashboardRoutes);
console.log('✅ Dashboard routes mounted');
app.use('/api/marks',     marksRoutes);
console.log('✅ Marks routes mounted');
app.use('/api/attendance',attendanceRoutes);
console.log('✅ Attendance routes mounted');
app.use('/api/fees',      feeRoutes);
console.log('✅ Fee routes mounted');

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studentDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "✅ Server is running" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});