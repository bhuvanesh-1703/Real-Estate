const mongoose = require('mongoose');
const SiteVisit = require('../models/SiteVisit');

let inMemoryVisits = [
  {
    id: 'VISIT-1',
    name: 'Karthik Raja',
    phone: '+91 91234 56789',
    propertyTitle: 'The Grand Royale Estate',
    visitDate: '2026-08-20',
    timeSlot: 'Morning (10 AM - 1 PM)',
    status: 'Scheduled'
  }
];

const getVisits = async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const visits = await SiteVisit.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: visits.length, data: visits });
    }
    res.json({ success: true, count: inMemoryVisits.length, data: inMemoryVisits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVisit = async (req, res) => {
  try {
    const { name, phone, email, propertyId, propertyTitle, visitDate, timeSlot } = req.body;

    if (!name || !phone || !visitDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, visit date, and time slot are required.'
      });
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const newVisit = await SiteVisit.create({
        name,
        phone,
        email,
        propertyId,
        propertyTitle: propertyTitle || 'General Property Visit',
        visitDate,
        timeSlot
      });
      return res.status(201).json({
        success: true,
        message: 'Site visit booked successfully.',
        data: newVisit
      });
    }

    const created = {
      id: `VISIT-${Date.now()}`,
      name,
      phone,
      email,
      propertyId,
      propertyTitle: propertyTitle || 'General Property Visit',
      visitDate,
      timeSlot,
      status: 'Scheduled'
    };

    inMemoryVisits.unshift(created);
    res.status(201).json({
      success: true,
      message: 'Site visit scheduled successfully.',
      data: created
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVisitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid visit ObjectId format' });
      }
      const updated = await SiteVisit.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Visit booking not found' });
      return res.json({ success: true, data: updated });
    }

    const idx = inMemoryVisits.findIndex(v => v.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Visit booking not found' });

    inMemoryVisits[idx].status = status;
    res.json({ success: true, data: inMemoryVisits[idx] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVisits,
  createVisit,
  updateVisitStatus
};
