const mongoose = require('mongoose');
const Property = require('../models/Property');
const Lead = require('../models/Lead');

const dummyProperties = [
  {
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
    description: 'Ultra-luxurious modern Italian architecture villa with private infinity pool, smart home automation, and 4 master suites.',
    features: ['Private Pool', 'Smart Home', '24/7 Security', 'Solar Powered'],
    highYield: true
  },
  {
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
    description: 'High-rise luxury apartment complex with panoramic city views, rooftop infinity deck, and automated parking.',
    features: ['Rooftop Garden', 'Clubhouse', 'Gym & Spa', 'EV Charging Stations'],
    highYield: false
  },
  {
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
    description: 'Serene gated community villa surrounded by lush greenery, landscaped Zen gardens, and private gazebo.',
    features: ['Gated Community', 'Landscaped Garden', 'Clubhouse', 'Power Backup'],
    highYield: true
  },
  {
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

const dummyLeads = [
  {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@example.com',
    property: 'The Grand Royale Estate',
    score: 92,
    status: 'HOT',
    query: 'Looking for immediate possession 4BHK villa.'
  },
  {
    name: 'Priya Sharma',
    phone: '+91 94432 10987',
    email: 'priya.sharma@example.com',
    property: 'Celestial Heights Residency',
    score: 75,
    status: 'WARM',
    query: 'Inquiring about home loan options and floor plan.'
  },
  {
    name: 'Vikram Sundaram',
    phone: '+91 97890 12345',
    email: 'vikram.s@example.com',
    property: 'Emerald Palms Gated Villa',
    score: 85,
    status: 'HOT',
    query: 'Requested site visit on weekend.'
  },
  {
    name: 'Ananya Ramesh',
    phone: '+91 96543 21876',
    email: 'ananya.ramesh@example.com',
    property: 'Aetheria Sky Enclave',
    score: 65,
    status: 'WARM',
    query: 'Interested in penthouse investment.'
  },
  {
    name: 'Karthik Subramanian',
    phone: '+91 91234 56789',
    email: 'karthik.sub@example.com',
    property: 'Greenwood Eco County Plots',
    score: 45,
    status: 'COLD',
    query: 'Requesting price breakdown for plots.'
  }
];

const seedInitialData = async () => {
  try {
    const propertyCount = await Property.countDocuments();
    if (propertyCount < 5) {
      console.log('[DB Seed] Refreshing 5 luxury real estate dummy properties into MongoDB...');
      await Property.deleteMany({});
      await Property.insertMany(dummyProperties);
      console.log('[DB Seed] 5 luxury properties seeded successfully into MongoDB.');
    }

    const leadCount = await Lead.countDocuments();
    if (leadCount < 5) {
      console.log('[DB Seed] Refreshing 5 sample CRM leads into MongoDB...');
      await Lead.deleteMany({});
      await Lead.insertMany(dummyLeads);
      console.log('[DB Seed] 5 CRM leads seeded successfully into MongoDB.');
    }
  } catch (err) {
    console.error('[DB Seed Error]:', err.message);
  }
};

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.log('db not conected');
      return false;
    }
    const conn = await mongoose.connect(connStr);
    console.log(`db conected ${conn.connection.host}`);
    
    await seedInitialData();

    return true;
  } catch (error) {
    console.warn(`[DB Warning] MongoDB Connection failed (${error.message}). Continuing in memory fallback mode.`);
    return false;
  }
};

module.exports = connectDB;
