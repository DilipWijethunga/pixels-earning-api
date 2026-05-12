require('dotenv').config();
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  date: Date,
  earnings: Number,
  earningsNote: String,
  expenses: Number,
  expensesNote: String,
  note: String,
  
  // New fields
  type: String,
  amount: Number,
  tag: String,
}, { strict: false });

const Entry = mongoose.model('Entry', entrySchema);

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB. Starting migration...');

  const entries = await Entry.find({ type: { $exists: false } });
  console.log(`Found ${entries.length} old entries to migrate.`);

  for (let entry of entries) {
    const date = entry.date;
    const globalNote = entry.note || '';

    // If it has earnings, create an earning entry
    if (entry.earnings && entry.earnings > 0) {
      await Entry.create({
        date: date,
        type: 'earning',
        amount: entry.earnings,
        tag: 'Taskboard', // Default tag
        note: entry.earningsNote || globalNote
      });
    }

    // If it has expenses, create an expense entry
    if (entry.expenses && entry.expenses > 0) {
      await Entry.create({
        date: date,
        type: 'expense',
        amount: entry.expenses,
        tag: 'coin stacks', // Default tag
        note: entry.expensesNote || globalNote
      });
    }

    // Delete the old combined entry
    await Entry.findByIdAndDelete(entry._id);
  }

  console.log('Migration complete.');
  process.exit(0);
}

migrate().catch(console.error);
