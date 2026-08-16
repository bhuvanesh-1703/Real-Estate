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
  propertyType: {
    type: String,
    enum: ['Villa', 'Apartment', 'Plots', 'Independent Houses', 'Commercial'],
    default: 'Villa'
  },
  // Backward compatibility alias field
  type: {
    type: String,
    default: 'Villa'
  },
  price: {
    type: String,
    required: true
  },
  priceNumeric: {
    type: Number,
    index: true
  },
  location: {
    type: String,
    required: true,
    index: true
  },
  area: {
    type: String,
    default: '2,000 sq.ft'
  },
  plotSize: {
    type: Number,
    index: true
  },
  plotSizeUnit: {
    type: String,
    default: 'sqft'
  },
  bhk: {
    type: Number,
    default: 3
  },
  status: {
    type: String,
    enum: ['Available', 'Selling Fast', 'Sold Out', 'Upcoming'],
    default: 'Available',
    index: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  },
  // Supports both array of objects [{ url, publicId }] and legacy string arrays
  images: [{
    url: { type: String },
    publicId: { type: String }
  }],
  // Backward compatibility string gallery array
  gallery: [{ type: String }],
  video: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
    duration: { type: Number, default: 0 } // Duration in seconds (max 15s)
  },
  features: [{ type: String }],
  description: { type: String },
  highYield: { type: Boolean, default: false },
  googleMapsUrl: { type: String, default: '' },
  latitude: { type: Number },
  longitude: { type: Number }
}, {
  timestamps: true
});

// Compound Index for Make.com + Gemini AI fast property matchmaking
propertySchema.index({ status: 1, propertyType: 1, priceNumeric: 1 });
propertySchema.index({ status: 1, location: 1 });

module.exports = mongoose.model('Property', propertySchema);
