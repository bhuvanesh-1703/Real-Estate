const mongoose = require('mongoose');
const Property = require('../models/Property');

// Fallback in-memory dataset (5 Dummy Luxury Properties)
let inMemoryProperties = [
  {
    id: 'prop-1',
    title: 'The Grand Royale Estate',
    slug: 'grand-royale-estate',
    price: '₹1.85 Cr',
    priceNumeric: 18500000,
    location: 'Anna Nagar West, Madurai',
    type: 'Villa',
    bhk: 4,
    area: '3,800 sq.ft',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-luxurious modern Italian architecture villa with private infinity pool and smart home automation.',
    features: ['Private Pool', 'Smart Home', '24/7 Security', 'Solar Powered'],
    highYield: true
  },
  {
    id: 'prop-2',
    title: 'Celestial Heights Residency',
    slug: 'celestial-heights',
    price: '₹78 Lakhs',
    priceNumeric: 7800000,
    location: 'KK Nagar, Madurai',
    type: 'Apartment',
    bhk: 3,
    area: '1,950 sq.ft',
    status: 'Selling Fast',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'High-rise luxury apartment complex with panoramic city views and rooftop clubhouse.',
    features: ['Rooftop Garden', 'Clubhouse', 'Gym & Spa', 'EV Charging Stations'],
    highYield: false
  },
  {
    id: 'prop-3',
    title: 'Emerald Palms Gated Villa',
    slug: 'emerald-palms-villa',
    price: '₹1.20 Cr',
    priceNumeric: 12000000,
    location: 'Ring Road Bypass, Madurai',
    type: 'Villa',
    bhk: 3,
    area: '2,600 sq.ft',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    description: 'Serene gated community villa surrounded by lush greenery and landscaped gardens.',
    features: ['Gated Community', 'Landscaped Garden', 'Clubhouse', 'Power Backup'],
    highYield: true
  },
  {
    id: 'prop-4',
    title: 'Aetheria Sky Enclave',
    slug: 'aetheria-sky-enclave',
    price: '₹2.45 Cr',
    priceNumeric: 24500000,
    location: 'Mattuthavani, Madurai',
    type: 'Apartment',
    bhk: 4,
    area: '4,100 sq.ft',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-exclusive penthouse suites with private elevators, sky lounge, and concierge services.',
    features: ['Penthouse Suite', 'Private Elevator', 'Sky Lounge', 'Helipad Access'],
    highYield: true
  },
  {
    id: 'prop-5',
    title: 'Greenwood Eco County Plots',
    slug: 'greenwood-eco-county',
    price: '₹48 Lakhs',
    priceNumeric: 4800000,
    location: 'Vadipatti Expressway, Madurai',
    type: 'Plots',
    bhk: 0,
    area: '2,400 sq.ft',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    description: 'DTCP & RERA approved premium villa plots ready for construction in a rapidly appreciating IT corridor.',
    features: ['DTCP Approved', 'RERA Registered', 'Blacktop Roads', 'Underground Utilities'],
    highYield: true
  }
];

// Get all properties with optional category/search filters
const getProperties = async (req, res) => {
  try {
    const { type, search } = req.query;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      let query = {};
      if (type && type !== 'All') query.type = type;
      if (search) query.title = { $regex: search, $options: 'i' };

      const properties = await Property.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: properties.length, data: properties });
    }

    let filtered = [...inMemoryProperties];
    if (type && type !== 'All') {
      filtered = filtered.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single property by slug
const getPropertyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const property = await Property.findOne({ slug });
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }
      return res.json({ success: true, data: property });
    }

    const found = inMemoryProperties.find(p => p.slug === slug);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({ success: true, data: found });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new property listing
const createProperty = async (req, res) => {
  try {
    const { title, price, location, type, bhk, area, status, description, image } = req.body;

    if (!title || !price || !location) {
      return res.status(400).json({ success: false, message: 'Title, price, and location are required.' });
    }

    const slug = (title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const newProperty = await Property.create({
        title,
        slug,
        price,
        location,
        type: type || 'Villa',
        bhk: Number(bhk) || 0,
        area: area || '2,200 sq.ft',
        status: status || 'Available',
        description: description || '',
        image: image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
      });
      return res.status(201).json({ success: true, data: newProperty });
    }

    const created = {
      id: `prop-${Date.now()}`,
      title,
      slug,
      price,
      location,
      type: type || 'Villa',
      bhk: Number(bhk) || 3,
      area: area || '2,200 sq.ft',
      status: status || 'Available',
      image: image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      description
    };

    inMemoryProperties.unshift(created);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update property
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid property ObjectId format' });
      }
      const updated = await Property.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Property not found' });
      return res.json({ success: true, data: updated });
    }

    const idx = inMemoryProperties.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Property not found' });

    inMemoryProperties[idx] = { ...inMemoryProperties[idx], ...req.body };
    res.json({ success: true, data: inMemoryProperties[idx] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid property ObjectId format' });
      }
      const deleted = await Property.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Property not found' });
      return res.json({ success: true, message: 'Property deleted successfully' });
    }

    inMemoryProperties = inMemoryProperties.filter(p => p.id !== id);
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty
};
