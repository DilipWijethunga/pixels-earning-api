const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    earningsNote: {
      type: String,
      default: '',
    },
    expenses: {
      type: Number,
      default: 0,
    },
    expensesNote: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Entry', entrySchema);
