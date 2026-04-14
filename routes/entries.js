const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// Helper to get week range (Monday to Sunday)
function getWeekRange(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

// GET /api/entries
router.get('/', async (req, res) => {
  try {
    const { year, month, week } = req.query;
    let filter = {};

    const now = new Date();

    if (week === 'true') {
      const { start, end } = getWeekRange(now);
      filter.date = { $gte: start, $lte: end };
    } else if (month) {
      const y = year ? parseInt(year) : now.getFullYear();
      const m = parseInt(month) - 1; // 0-indexed
      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    } else if (year) {
      const y = parseInt(year);
      const start = new Date(y, 0, 1);
      const end = new Date(y, 11, 31, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const entries = await Entry.find(filter).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/entries
router.post('/', async (req, res) => {
  try {
    const { date, earnings, earningsNote, expenses, expensesNote, note } = req.body;
    const entry = new Entry({
      date: new Date(date),
      earnings: earnings || 0,
      earningsNote: earningsNote || '',
      expenses: expenses || 0,
      expensesNote: expensesNote || '',
      note: note || '',
    });
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/entries/:id
router.put('/:id', async (req, res) => {
  try {
    const { date, earnings, earningsNote, expenses, expensesNote, note } = req.body;
    const updated = await Entry.findByIdAndUpdate(
      req.params.id,
      {
        date: new Date(date),
        earnings: earnings || 0,
        earningsNote: earningsNote || '',
        expenses: expenses || 0,
        expensesNote: expensesNote || '',
        note: note || '',
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Entry not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/entries/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Entry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
