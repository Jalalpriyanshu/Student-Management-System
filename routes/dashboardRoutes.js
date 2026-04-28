const express = require('express');
const router  = express.Router();
const Student = require('../models/Student');

/* ── helpers ─────────────────────────────────────────────── */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/* ── GET /api/dashboard/stats ────────────────────────────── */
router.get('/stats', async (req, res) => {
  try {
    const students      = await Student.find();
    const totalStudents = students.length;
    const courses       = [...new Set(students.map(s => s.course).filter(Boolean))];
    const totalCourses  = courses.length;

    res.json({
      totalStudents,
      totalCourses,
      totalTeachers : 18,
      totalUnits    : 24,
      totalMarks    : 320,
      attendanceRate: 85,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /api/dashboard/top-performers ───────────────────── */
router.get('/top-performers', async (req, res) => {
  try {
    const students = await Student.find().limit(9);

    const withScores = students.map((s, i) => ({
      _id    : s._id,
      name   : s.name,
      course : s.course,
      email  : s.email,
      avatar : `https://i.pravatar.cc/60?img=${(i % 70) + 1}`,
      marks  : rand(75, 99),
      attendance: rand(80, 100),
      improvement: rand(5, 25),
    }));

    const byMarks      = [...withScores].sort((a, b) => b.marks - a.marks).slice(0, 3);
    const byAttendance = [...withScores].sort((a, b) => b.attendance - a.attendance).slice(0, 3);
    const byImproved   = [...withScores].sort((a, b) => b.improvement - a.improvement).slice(0, 3);

    res.json({ byMarks, byAttendance, byImproved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /api/dashboard/attendance ───────────────────────── */
router.get('/attendance', async (req, res) => {
  const subjects = [
    { subject: 'Mathematics',  pct: rand(72, 95) },
    { subject: 'Science',      pct: rand(72, 95) },
    { subject: 'English',      pct: rand(72, 95) },
    { subject: 'History',      pct: rand(72, 95) },
    { subject: 'Computer',     pct: rand(72, 95) },
    { subject: 'Physics',      pct: rand(72, 95) },
  ];
  res.json(subjects);
});

/* ── GET /api/dashboard/timetable ────────────────────────── */
router.get('/timetable', async (req, res) => {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  const subjects = ['Mathematics','Science','English','History','Computer','Physics','Chemistry','Biology'];
  const teachers = [
    { name: 'Dr. Sharma',   avatar: 'https://i.pravatar.cc/40?img=11' },
    { name: 'Ms. Patel',    avatar: 'https://i.pravatar.cc/40?img=20' },
    { name: 'Mr. Verma',    avatar: 'https://i.pravatar.cc/40?img=15' },
    { name: 'Dr. Singh',    avatar: 'https://i.pravatar.cc/40?img=33' },
    { name: 'Ms. Gupta',    avatar: 'https://i.pravatar.cc/40?img=47' },
  ];
  const times = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM'];

  const today = days[new Date().getDay() - 1] || 'Monday';
  const slots = Array.from({ length: 5 }, (_, i) => ({
    time   : times[i],
    subject: subjects[rand(0, subjects.length - 1)],
    teacher: teachers[rand(0, teachers.length - 1)],
    room   : `Room ${rand(101, 310)}`,
  }));

  res.json({ day: today, slots });
});

/* ── GET /api/dashboard/announcements ────────────────────── */
router.get('/announcements', async (req, res) => {
  res.json([
    { id: 1, type: 'exam',       title: 'Mid-Term Exams',         body: 'Mid-term examinations scheduled from next Monday. All students must carry their ID cards.',  date: '2 hours ago',  color: '#ef4444' },
    { id: 2, type: 'internship', title: 'Internship Applications', body: 'Applications open for summer internship at TechCorp. Last date: 30th of this month.',        date: '5 hours ago',  color: '#6366f1' },
    { id: 3, type: 'leave',      title: 'Teachers on Leave',       body: 'Dr. Sharma (Math) and Ms. Patel (Science) are on leave today. Substitute classes arranged.',  date: '1 day ago',    color: '#f59e0b' },
    { id: 4, type: 'event',      title: 'Annual Sports Day',       body: 'Annual sports day will be held on Friday. Participation is mandatory for all students.',      date: '2 days ago',   color: '#10b981' },
  ]);
});

/* ── GET /api/dashboard/exam-results ─────────────────────── */
router.get('/exam-results', async (req, res) => {
  const subjects = ['Math','Science','English','History','Computer','Physics'];
  res.json(subjects.map(subject => ({
    subject,
    pass : rand(60, 90),
    fail : rand(5, 25),
    avg  : rand(55, 85),
  })));
});

module.exports = router;
