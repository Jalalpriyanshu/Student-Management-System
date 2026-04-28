const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Student = require("../models/Student");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype))
      cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});

// ✅ GET all students with pagination — MUST be before /:id
router.get("/all", async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip  = (page - 1) * limit;
    const students = await Student.find().skip(skip).limit(limit);
    const total    = await Student.countDocuments();
    res.json({ students, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ✅ SEARCH — MUST be before /:id
router.get("/search/query", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Search query required" });
    const students = await Student.find({
      $or: [
        { name:   { $regex: q, $options: "i" } },
        { course: { $regex: q, $options: "i" } },
      ],
    });
    res.json(students);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ✅ CREATE
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, email, phone, course, age } = req.body;
    if (!name || !email || !phone || !course)
      return res.status(400).json({ error: "Name, Email, Phone, and Course are required" });
    const student = new Student({
      name, email, phone, course, age,
      image: req.file ? `uploads/${req.file.filename}` : null,
    });
    await student.save();
    res.status(201).json({ message: "Student added successfully", student });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ✅ GET single student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ✅ UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, email, phone, course, age } = req.body;
    if (!name || !email || !phone || !course)
      return res.status(400).json({ error: "Name, Email, Phone, and Course are required" });
    const updateData = { name, email, phone, course, age };
    if (req.file) updateData.image = `uploads/${req.file.filename}`;
    const student = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student updated successfully", student });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
