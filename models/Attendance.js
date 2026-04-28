const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId : { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject   : { type: String, required: true },
  date      : { type: Date, required: true },
  status    : { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' },
  academicYear: { type: String, default: '2024-25' },
}, { timestamps: true });

// Prevent duplicate attendance for same student+subject+date
attendanceSchema.index({ studentId: 1, subject: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
