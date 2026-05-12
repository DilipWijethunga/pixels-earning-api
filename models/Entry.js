const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['earning', 'expense'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    tag: {
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
