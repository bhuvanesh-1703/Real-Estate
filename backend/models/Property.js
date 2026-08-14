const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  price: {
    type: String,
    required: true
  },
  priceNumeric: {
    type: Number
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Villa', 'Apartment', 'Plots', 'Independent Houses', 'Commercial'],
    default: 'Villa'
  },
  bhk: {
    type: Number,
    default: 3
  },
  area: {
    type: String,
    default: '2,000 sq.ft'
  },
  status: {
    type: String,
    enum: ['Available', 'Selling Fast', 'Sold Out', 'Upcoming'],
    default: 'Available'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  },
  images: [{ type: String }],
  features: [{ type: String }],
  description: { type: String },
  highYield: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
