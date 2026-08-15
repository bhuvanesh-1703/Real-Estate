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

/**
 * Non-destructive initial data seeding.
 * Never deletes existing production data!
 * Seeding occurs ONLY if process.env.SEED_DEMO_DATA === 'true'.
 */
const seedInitialData = async () => {
  const shouldSeed = process.env.SEED_DEMO_DATA === 'true';
  if (!shouldSeed) {
    console.log('[DB Seed] Demo data seeding is disabled (SEED_DEMO_DATA is not "true"). Preserving existing database records.');
    return;
  }

  try {
    console.log('[DB Seed] SEED_DEMO_DATA is enabled. Running non-destructive seed check...');
    
    // Seed missing properties without calling deleteMany!
    for (const prop of dummyProperties) {
      const exists = await Property.findOne({ slug: prop.slug });
      if (!exists) {
        await Property.create(prop);
        console.log(`[DB Seed] Inserted missing demo property: ${prop.title}`);
      }
    }

    // Seed missing leads without calling deleteMany!
    for (const lead of dummyLeads) {
      const exists = await Lead.findOne({ email: lead.email });
      if (!exists) {
        await Lead.create(lead);
        console.log(`[DB Seed] Inserted missing demo lead: ${lead.name}`);
      }
    }

    console.log('[DB Seed] Non-destructive seeding check complete.');
  } catch (err) {
    console.error('[DB Seed Error]:', err.message);
  }
};

/**
 * Safely clean and normalize connection strings
 */
const sanitizeUri = (rawUri) => {
  if (!rawUri || typeof rawUri !== 'string') return '';
  let cleaned = rawUri.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  if (cleaned.toLowerCase().startsWith('mongodb_uri=')) {
    cleaned = cleaned.slice(12).trim();
  } else if (cleaned.toLowerCase().startsWith('mongo_uri=')) {
    cleaned = cleaned.slice(10).trim();
  }
  return cleaned;
};

const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGODB_URL || process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production' || process.env.STRICT_DB === 'true';

  const exists = Boolean(rawUri);
  const connStr = sanitizeUri(rawUri);
  const length = connStr.length;
  const startsWithStandard = connStr.startsWith('mongodb://') || connStr.startsWith('mongodb+srv://');

  console.log('[DB Debug] MONGODB_URI exists:', exists);
  if (exists) {
    console.log('[DB Debug] URI type:', typeof connStr);
    console.log('[DB Debug] URI length:', length);
    console.log('[DB Debug] URI scheme:', connStr.startsWith('mongodb+srv://') ? 'mongodb+srv://' : connStr.startsWith('mongodb://') ? 'mongodb://' : 'invalid/http');
    console.log('[DB Debug] URI starts correctly:', startsWithStandard);
  }

  if (!connStr) {
    console.error('[DB Error] MONGODB_URI environment variable is missing.');
    if (isProduction) {
      console.error('[DB Fatal] Production mode requires MONGODB_URI. Server startup aborted.');
      return false;
    }
    console.warn('[DB Warning] Operating in local mock/in-memory fallback mode.');
    return false;
  }

  if (!startsWithStandard) {
    console.error('[DB Error] MONGODB_URI has an invalid scheme. Must start with "mongodb://" or "mongodb+srv://".');
    if (connStr.startsWith('http://') || connStr.startsWith('https://')) {
      console.error('[DB Hint] MONGODB_URI appears to be an HTTP URL. Update MONGODB_URI in Render to a MongoDB Atlas connection string.');
    }
    if (isProduction) {
      console.error('[DB Fatal] Invalid MONGODB_URI scheme in production. Server startup aborted.');
      return false;
    }
    console.warn('[DB Warning] Operating in local mock/in-memory fallback mode.');
    return false;
  }

  console.log('[DB Debug] Database connection attempt started...');

  try {
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[DB] MongoDB Connected Successfully: ${conn.connection.host}`);
    
    await seedInitialData();
    return true;
  } catch (error) {
    console.error(`[DB Error] MongoDB connection failed: ${error.message}`);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('[DB Diagnosis] Network/IP Access Issue: MongoDB Atlas server was unreachable. Verify Network Access in MongoDB Atlas (Whitelist 0.0.0.0/0 for Render).');
    } else if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('[DB Diagnosis] Auth Issue: Incorrect database username or password. Ensure special characters are URL-encoded.');
    }

    if (isProduction) {
      console.error('[DB Fatal] Production database connection failed.');
      return false;
    }

    console.warn('[DB Warning] Continuing in memory fallback mode for local development.');
    return false;
  }
};

module.exports = connectDB;
