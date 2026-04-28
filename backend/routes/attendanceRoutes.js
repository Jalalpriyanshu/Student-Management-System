const express    = require('express');
const router     = express.Router();
const Attendance = require('../models/Attendance');

// GET /api/attendance/all
router.get('/all', async (req, res) => {
  try {
    const { studentId, subject, date } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (subject)   filter.subject   = subject;
    if (date)      filter.date      = { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) };

    const records = await Attendance.find(filter).populate('studentId', 'name course').sort({ date: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/attendance/summary/:studentId — % per subject
router.get('/summary/:studentId', async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.params.studentId });
    const map = {};
    records.forEach(r => {
      if (!map[r.subject]) map[r.subject] = { total: 0, present: 0 };
      map[r.subject].total++;
      if (r.status === 'Present') map[r.subject].present++;
    });
    const summary = Object.entries(map).map(([subject, v]) => ({
      subject,
      total  : v.total,
      present: v.present,
      pct    : Math.round((v.present / v.total) * 100),
    }));
    res.json(summary);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/attendance/mark — bulk mark for a date+subject
router.post('/mark', async (req, res) => {
  try {
    const { records } = req.body; // [{ studentId, subject, date, status }]
    if (!records?.length) return res.status(400).json({ error: 'records array required.' });

    const ops = records.map(r => ({
      updateOne: {
        filter: { studentId: r.studentId, subject: r.subject, date: new Date(r.date) },
        update: { $set: { status: r.status, academicYear: r.academicYear || '2024-25' } },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);
    res.json({ message: `${records.length} attendance records saved.` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
