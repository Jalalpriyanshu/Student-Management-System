const express = require('express');
const router  = express.Router();
const Marks   = require('../models/Marks');
const Student = require('../models/Student');

// GET /api/marks/all — all marks with student info
router.get('/all', async (req, res) => {
  try {
    const marks = await Marks.find().populate('studentId', 'name course email').sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/marks/student/:studentId
router.get('/student/:studentId', async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.params.studentId });
    res.json(marks);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/marks/add
router.post('/add', async (req, res) => {
  try {
    const { studentId, subject, marks, maxMarks, examType, academicYear } = req.body;
    if (!studentId || !subject || marks === undefined)
      return res.status(400).json({ error: 'studentId, subject and marks are required.' });

    const existing = await Marks.findOne({ studentId, subject, examType, academicYear });
    if (existing) {
      existing.marks = marks;
      await existing.save();
      return res.json({ message: 'Marks updated.', marks: existing });
    }

    const m = await Marks.create({ studentId, subject, marks, maxMarks, examType, academicYear });
    res.status(201).json({ message: 'Marks added.', marks: m });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/marks/:id
router.put('/:id', async (req, res) => {
  try {
    const m = await Marks.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!m) return res.status(404).json({ error: 'Not found.' });
    res.json({ message: 'Updated.', marks: m });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/marks/:id
router.delete('/:id', async (req, res) => {
  try {
    await Marks.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
