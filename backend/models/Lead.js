const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  property: {
    type: String,
    default: 'General Inquiry'
  },
  date: { type: String },
  time: { type: String },
  query: { type: String },
  score: {
    type: Number,
    default: 50
  },
  status: {
    type: String,
    enum: ['HOT', 'WARM', 'COLD'],
    default: 'WARM'
  },
  source: {
    type: String,
    default: 'Website Form'
  },
  notes: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
