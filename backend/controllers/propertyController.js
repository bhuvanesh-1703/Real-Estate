const mongoose = require('mongoose');
const Property = require('../models/Property');
const {
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
  destroyCloudinaryAsset,
  isCloudinaryConfigured
} = require('../services/cloudinaryService');

// Fallback in-memory dataset
let inMemoryProperties = [
  {
    id: 'prop-1',
    title: 'The Grand Royale Estate',
    slug: 'grand-royale-estate',
    propertyType: 'Villa',
    type: 'Villa',
    price: '₹1.85 Cr',
    priceNumeric: 18500000,
    location: 'Anna Nagar West, Madurai',
    area: '3,800 sq.ft',
    plotSize: 3800,
    plotSizeUnit: 'sqft',
    bhk: 4,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', publicId: '' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', publicId: '' },
      { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80', publicId: '' }
    ],
    video: {
      url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-villa-exterior-41561-large.mp4',
      publicId: '',
      duration: 12
    },
    description: 'Ultra-luxurious modern Italian architecture villa with private infinity pool and smart home automation.',
    features: ['Private Pool', 'Smart Home', '24/7 Security', 'Solar Powered'],
    highYield: true,
    googleMapsUrl: 'https://maps.google.com/?q=Anna+Nagar+Madurai',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prop-2',
    title: 'Celestial Heights Residency',
    slug: 'celestial-heights',
    propertyType: 'Apartment',
    type: 'Apartment',
    price: '₹78 Lakhs',
    priceNumeric: 7800000,
    location: 'KK Nagar, Madurai',
    area: '1,950 sq.ft',
    plotSize: 1950,
    plotSizeUnit: 'sqft',
    bhk: 3,
    status: 'Selling Fast',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', publicId: '' }
    ],
    video: { url: '', publicId: '', duration: 0 },
    description: 'High-rise luxury apartment complex with panoramic city views and rooftop clubhouse.',
    features: ['Rooftop Garden', 'Clubhouse', 'Gym & Spa', 'EV Charging Stations'],
    highYield: false,
    googleMapsUrl: 'https://maps.google.com/?q=KK+Nagar+Madurai',
    createdAt: new Date().toISOString()
  }
];

/**
 * GET /api/properties
 * Filter & search properties
 */
const getProperties = async (req, res) => {
  try {
    const { type, propertyType, location, status, maxPrice, minPlotSize, search, sort } = req.query;

    const selectedType = propertyType || type;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      let query = {};
      if (selectedType && selectedType !== 'All') {
        query.$or = [{ propertyType: selectedType }, { type: selectedType }];
      }
      if (status && status !== 'ALL') {
        query.status = status;
      }
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
      if (maxPrice) {
        query.priceNumeric = { $lte: Number(maxPrice) };
      }
      if (minPlotSize) {
        query.plotSize = { $gte: Number(minPlotSize) };
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price-asc') sortOptions = { priceNumeric: 1 };
      if (sort === 'price-desc') sortOptions = { priceNumeric: -1 };
      if (sort === 'size-desc') sortOptions = { plotSize: -1 };

      const properties = await Property.find(query).sort(sortOptions);
      return res.json({ success: true, count: properties.length, data: properties });
    }

    // In-Memory Fallback
    let filtered = [...inMemoryProperties];
    if (selectedType && selectedType !== 'All') {
      filtered = filtered.filter(p => (p.propertyType || p.type).toLowerCase() === selectedType.toLowerCase());
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter(p => p.status === status);
    }
    if (location) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (search) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => (p.priceNumeric || 0) <= Number(maxPrice));
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/properties/:id or slug
 */
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      let property;
      if (mongoose.Types.ObjectId.isValid(id)) {
        property = await Property.findById(id);
      }
      if (!property) {
        property = await Property.findOne({ slug: id });
      }
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }
      return res.json({ success: true, data: property });
    }

    const found = inMemoryProperties.find(p => p.id === id || p.slug === id);
    if (!found) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: found });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Helper to process price string into priceNumeric
 */
const parseNumericPrice = (priceStr) => {
  if (!priceStr) return 0;
  if (typeof priceStr === 'number') return priceStr;
  
  const cleanStr = String(priceStr).replace(/,/g, '');
  const lakhMatch = cleanStr.match(/([\d.]+)\s*Lakh/i);
  if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000);
  
  const crMatch = cleanStr.match(/([\d.]+)\s*Cr/i);
  if (crMatch) return Math.round(parseFloat(crMatch[1]) * 10000000);
  
  const numOnly = parseFloat(cleanStr.replace(/[^\d.]/g, ''));
  return isNaN(numOnly) ? 0 : numOnly;
};

/**
 * Helper to parse plot size
 */
const parsePlotSize = (areaStr) => {
  if (!areaStr) return 2000;
  if (typeof areaStr === 'number') return areaStr;
  const numOnly = parseFloat(String(areaStr).replace(/,/g, '').replace(/[^\d.]/g, ''));
  return isNaN(numOnly) ? 2000 : numOnly;
};

/**
 * POST /api/properties
 * Create property with Cloudinary image and video upload support
 */
const createProperty = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      title,
      price,
      priceNumeric,
      location,
      propertyType,
      type,
      bhk,
      area,
      plotSize,
      plotSizeUnit,
      status,
      description,
      features,
      highYield,
      googleMapsUrl,
      latitude,
      longitude
    } = body;

    if (!title || !price || !location) {
      return res.status(400).json({ success: false, message: 'Title, Price, and Location are required fields.' });
    }

    const finalType = propertyType || type || 'Villa';
    const slug = (title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;
    const computedPriceNumeric = priceNumeric ? Number(priceNumeric) : parseNumericPrice(price);
    const computedPlotSize = plotSize ? Number(plotSize) : parsePlotSize(area);

    // Process Cloudinary Uploads if multipart files present
    let uploadedImages = [];
    let uploadedVideo = { url: '', publicId: '', duration: 0 };

    if (req.files) {
      // 1. Handle Images Upload
      if (req.files.images && req.files.images.length > 0) {
        for (const imgFile of req.files.images) {
          if (isCloudinaryConfigured()) {
            const uploaded = await uploadImageToCloudinary(imgFile.buffer);
            uploadedImages.push(uploaded);
          }
        }
      }

      // 2. Handle Video Upload with 15s Validation
      if (req.files.video && req.files.video.length > 0) {
        const vidFile = req.files.video[0];
        if (isCloudinaryConfigured()) {
          try {
            uploadedVideo = await uploadVideoToCloudinary(vidFile.buffer);
          } catch (vidErr) {
            return res.status(400).json({ success: false, message: vidErr.message || 'Video upload failed' });
          }
        }
      }
    }

    // Process fallback JSON or string images if passed directly
    if (uploadedImages.length === 0) {
      let rawImages = req.body.images;
      if (typeof rawImages === 'string') {
        try {
          rawImages = JSON.parse(rawImages);
        } catch (e) {
          rawImages = [rawImages];
        }
      }
      if (Array.isArray(rawImages)) {
        uploadedImages = rawImages.map(img => typeof img === 'string' ? { url: img, publicId: '' } : img);
      } else if (req.body.image) {
        uploadedImages = [{ url: req.body.image, publicId: '' }];
      } else {
        uploadedImages = [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', publicId: '' }];
      }
    }

    if (!uploadedVideo.url && req.body.video) {
      let rawVideo = req.body.video;
      if (typeof rawVideo === 'string') {
        try {
          rawVideo = JSON.parse(rawVideo);
        } catch (e) {
          rawVideo = { url: rawVideo, publicId: '', duration: 10 };
        }
      }
      if (typeof rawVideo === 'object' && rawVideo !== null) {
        uploadedVideo = {
          url: rawVideo.url || '',
          publicId: rawVideo.publicId || '',
          duration: Number(rawVideo.duration) || 0
        };
      }
    }

    const mainImageUrl = uploadedImages[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

    // Safely parse features array
    let parsedFeatures = [];
    if (Array.isArray(features)) {
      parsedFeatures = features;
    } else if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        parsedFeatures = features.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const propertyPayload = {
      title,
      slug,
      propertyType: finalType,
      type: finalType,
      price,
      priceNumeric: computedPriceNumeric,
      location,
      area: area || `${computedPlotSize} sq.ft`,
      plotSize: computedPlotSize,
      plotSizeUnit: plotSizeUnit || 'sqft',
      bhk: Number(bhk) || 0,
      status: status || 'Available',
      description: description || '',
      features: parsedFeatures,
      highYield: highYield === 'true' || highYield === true,
      image: mainImageUrl,
      images: uploadedImages,
      gallery: uploadedImages.map(i => i.url),
      video: uploadedVideo,
      googleMapsUrl: googleMapsUrl || '',
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined
    };

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const newProperty = await Property.create(propertyPayload);
      return res.status(201).json({ success: true, message: 'Property created successfully', data: newProperty });
    }

    const inMemProp = { id: `prop-${Date.now()}`, ...propertyPayload, createdAt: new Date().toISOString() };
    inMemoryProperties.unshift(inMemProp);
    res.status(201).json({ success: true, message: 'Property created successfully (in-memory)', data: inMemProp });
  } catch (error) {
    console.error('[Property Controller Error] createProperty failure:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create property' });
  }
};

/**
 * PUT /api/properties/:id
 * Update property with Cloudinary media cleanup on replacement
 */
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...(req.body || {}) };

    if (body.price) body.priceNumeric = parseNumericPrice(body.price);
    if (body.area) body.plotSize = parsePlotSize(body.area);
    if (body.propertyType) body.type = body.propertyType;

    if (body.features) {
      if (typeof body.features === 'string') {
        try {
          body.features = JSON.parse(body.features);
        } catch (e) {
          body.features = body.features.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    if (body.video && typeof body.video === 'string') {
      try {
        body.video = JSON.parse(body.video);
      } catch (e) {
        body.video = { url: body.video, publicId: '', duration: 10 };
      }
    }

    // Process file replacements if multipart data provided
    if (req.files) {
      if (req.files.images && req.files.images.length > 0) {
        const uploadedImages = [];
        for (const imgFile of req.files.images) {
          if (isCloudinaryConfigured()) {
            const uploaded = await uploadImageToCloudinary(imgFile.buffer);
            uploadedImages.push(uploaded);
          }
        }
        if (uploadedImages.length > 0) {
          body.images = uploadedImages;
          body.image = uploadedImages[0].url;
          body.gallery = uploadedImages.map(i => i.url);
        }
      }

      if (req.files.video && req.files.video.length > 0) {
        const vidFile = req.files.video[0];
        if (isCloudinaryConfigured()) {
          try {
            const uploadedVid = await uploadVideoToCloudinary(vidFile.buffer);
            body.video = uploadedVid;
          } catch (vidErr) {
            return res.status(400).json({ success: false, message: vidErr.message });
          }
        }
      }
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Property ID format' });
      }

      const existing = await Property.findById(id);
      if (!existing) return res.status(404).json({ success: false, message: 'Property not found' });

      // Clean up old Cloudinary video if video was replaced
      if (body.video && existing.video && existing.video.publicId && body.video.publicId !== existing.video.publicId) {
        await destroyCloudinaryAsset(existing.video.publicId, 'video');
      }

      const updated = await Property.findByIdAndUpdate(id, body, { new: true });
      return res.json({ success: true, message: 'Property updated successfully', data: updated });
    }

    const idx = inMemoryProperties.findIndex(p => p.id === id || p._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Property not found' });

    inMemoryProperties[idx] = { ...inMemoryProperties[idx], ...body, updatedAt: new Date().toISOString() };
    res.json({ success: true, message: 'Property updated successfully', data: inMemoryProperties[idx] });
  } catch (error) {
    console.error('[Property Controller Error] updateProperty failure:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/properties/:id/status
 * Change Property Status
 */
const patchPropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const validStatuses = ['Available', 'Selling Fast', 'Sold Out', 'Upcoming'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Property ID format' });
      }

      const updated = await Property.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Property not found' });
      return res.json({ success: true, message: `Property status changed to ${status}`, data: updated });
    }

    const idx = inMemoryProperties.findIndex(p => p.id === id || p._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Property not found' });

    inMemoryProperties[idx].status = status;
    res.json({ success: true, message: `Property status changed to ${status}`, data: inMemoryProperties[idx] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/properties/:id
 * Delete property document and associated Cloudinary assets
 */
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Property ID format' });
      }

      const property = await Property.findById(id);
      if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

      // Clean up Cloudinary Images
      if (property.images && Array.isArray(property.images)) {
        for (const img of property.images) {
          if (img.publicId) {
            await destroyCloudinaryAsset(img.publicId, 'image');
          }
        }
      }

      // Clean up Cloudinary Video
      if (property.video && property.video.publicId) {
        await destroyCloudinaryAsset(property.video.publicId, 'video');
      }

      await Property.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Property and associated media deleted successfully' });
    }

    inMemoryProperties = inMemoryProperties.filter(p => p.id !== id && p._id !== id);
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/properties/upload-media
 * Standalone media upload endpoint (Cloudinary)
 */
const uploadMedia = async (req, res) => {
  try {
    if (!req.files && !req.file) {
      return res.status(400).json({ success: false, message: 'No media file provided' });
    }

    const uploadedImages = [];
    let uploadedVideo = null;

    if (req.files?.images) {
      for (const imgFile of req.files.images) {
        if (isCloudinaryConfigured()) {
          const img = await uploadImageToCloudinary(imgFile.buffer);
          uploadedImages.push(img);
        }
      }
    }

    if (req.files?.video && req.files.video.length > 0) {
      const vidFile = req.files.video[0];
      if (isCloudinaryConfigured()) {
        uploadedVideo = await uploadVideoToCloudinary(vidFile.buffer);
      }
    }

    return res.json({
      success: true,
      data: {
        images: uploadedImages,
        video: uploadedVideo
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Media upload failed' });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  patchPropertyStatus,
  deleteProperty,
  uploadMedia
};
