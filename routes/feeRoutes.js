const express = require('express');
const router  = express.Router();
const Fee     = require('../models/Fee');
const Student = require('../models/Student');

console.log('✅ Fee routes module loaded');

// GET all fees (populated with student)
router.get('/all', async (req, res) => {
  try {
    console.log('📋 GET /api/fees/all - Fetching all fees');
    const fees = await Fee.find().populate('studentId', 'name course email').sort({ createdAt: -1 });
    console.log(`✅ Retrieved ${fees.length} fee records`);
    res.json(fees);
  } catch (err) { 
    console.error('❌ Error in GET /all:', err.message);
    res.status(500).json({ error: err.message }); 
  }
});

// GET fee summary stats
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 GET /api/fees/stats - Fetching fee statistics');
    const all     = await Fee.find();
    const total   = all.reduce((s, f) => s + f.amount, 0);
    const paid    = all.filter(f => f.status === 'Paid').reduce((s, f) => s + f.amount, 0);
    const pending = all.filter(f => f.status === 'Pending').reduce((s, f) => s + f.amount, 0);
    const overdue = all.filter(f => f.status === 'Overdue').reduce((s, f) => s + f.amount, 0);
    const stats = { total, paid, pending, overdue,
      totalCount: all.length,
      paidCount: all.filter(f => f.status === 'Paid').length,
      pendingCount: all.filter(f => f.status === 'Pending').length,
      overdueCount: all.filter(f => f.status === 'Overdue').length,
    };
    console.log('✅ Stats calculated:', stats);
    res.json(stats);
  } catch (err) { 
    console.error('❌ Error in GET /stats:', err.message);
    res.status(500).json({ error: err.message }); 
  }
});

// POST add fee record
router.post('/add', async (req, res) => {
  try {
    console.log('📝 POST /api/fees/add - Adding new fee record');
    console.log('Request body:', req.body);
    const { studentId, amount, feeType, status, dueDate, paidDate, academicYear, remarks } = req.body;
    if (!studentId || !amount || !dueDate) {
      console.warn('⚠️ Missing required fields: studentId=' + !!studentId + ', amount=' + !!amount + ', dueDate=' + !!dueDate);
      return res.status(400).json({ error: 'Student, amount and due date are required.' });
    }
    const fee = await Fee.create({ studentId, amount, feeType, status, dueDate, paidDate: paidDate || null, academicYear, remarks });
    const populated = await fee.populate('studentId', 'name course email');
    console.log('✅ Fee record created:', fee._id);
    res.status(201).json(populated);
  } catch (err) { 
    console.error('❌ Error in POST /add:', err.message);
    res.status(500).json({ error: err.message }); 
  }
});

// PUT update fee status
router.put('/:id', async (req, res) => {
  try {
    console.log(`🔄 PUT /api/fees/${req.params.id} - Updating fee record`);
    const update = { ...req.body };
    if (update.status === 'Paid' && !update.paidDate) update.paidDate = new Date();
    const fee = await Fee.findByIdAndUpdate(req.params.id, update, { new: true }).populate('studentId', 'name course email');
    if (!fee) {
      console.warn(`⚠️ Fee record not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Fee record not found.' });
    }
    console.log(`✅ Fee record updated: ${fee._id}`);
    res.json(fee);
  } catch (err) { 
    console.error(`❌ Error in PUT /:id:`, err.message);
    res.status(500).json({ error: err.message }); 
  }
});

// DELETE fee record
router.delete('/:id', async (req, res) => {
  try {
    console.log(`🗑️ DELETE /api/fees/${req.params.id} - Deleting fee record`);
    await Fee.findByIdAndDelete(req.params.id);
    console.log(`✅ Fee record deleted: ${req.params.id}`);
    res.json({ message: 'Deleted successfully.' });
  } catch (err) { 
    console.error(`❌ Error in DELETE /:id:`, err.message);
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;
