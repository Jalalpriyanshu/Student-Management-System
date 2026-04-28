const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount:      { type: Number, required: true },
  feeType:     { type: String, enum: ['Tuition', 'Exam', 'Library', 'Sports', 'Transport', 'Other'], default: 'Tuition' },
  status:      { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  dueDate:     { type: Date, required: true },
  paidDate:    { type: Date },
  academicYear:{ type: String, default: '2024-25' },
  remarks:     { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
