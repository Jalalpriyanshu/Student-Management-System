const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentId : { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject   : { type: String, required: true },
  marks     : { type: Number, required: true, min: 0, max: 100 },
  maxMarks  : { type: Number, default: 100 },
  examType  : { type: String, enum: ['Mid-Term', 'Final', 'Unit Test', 'Assignment'], default: 'Final' },
  academicYear: { type: String, default: '2024-25' },
}, { timestamps: true });

module.exports = mongoose.model('Marks', marksSchema);
