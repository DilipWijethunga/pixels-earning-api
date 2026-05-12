const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// GET /api/tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tags
router.post('/', async (req, res) => {
  try {
    const { type, name } = req.body;
    const existing = await Tag.findOne({ type, name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'Tag already exists' });
    }
    const tag = new Tag({ type, name });
    const saved = await tag.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/tags/:id
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Tag.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Tag not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tags/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tag.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Tag not found' });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed default tags
router.post('/seed', async (req, res) => {
  try {
    const count = await Tag.countDocuments();
    if (count === 0) {
      const defaults = [
        { type: 'earning', name: 'Taskboard' },
        { type: 'earning', name: 'Stacked' },
        { type: 'earning', name: 'Creator code' },
        { type: 'earning', name: 'giveaways' },
        { type: 'expense', name: 'coin stacks' },
        { type: 'expense', name: 'quicksilver' },
        { type: 'expense', name: 'zones' },
        { type: 'expense', name: 'giveaway' },
      ];
      await Tag.insertMany(defaults);
      return res.json({ message: 'Seeded default tags' });
    }
    res.json({ message: 'Tags already exist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
