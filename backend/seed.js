require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentDB');

  const existing = await User.findOne({ email: 'admin@example.com' });
  if (existing) {
    console.log('✅ Admin user already exists. Login with admin@example.com / admin123');
    return mongoose.disconnect();
  }

  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({ name: 'Admin', email: 'admin@example.com', password: hashed, role: 'admin' });
  console.log('✅ Admin user created! Login with admin@example.com / admin123');
  mongoose.disconnect();
}

seed().catch(err => { console.error('❌', err.message); process.exit(1); });
