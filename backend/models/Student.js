const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: { type: String, trim: true },
    guardianName: { type: String, trim: true },
    enrollmentYear: { type: Number, default: () => new Date().getFullYear() },
    status: { type: String, enum: ['Active', 'Inactive', 'Graduated'], default: 'Active' },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
