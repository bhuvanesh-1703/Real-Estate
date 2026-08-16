const mongoose = require("mongoose");
const Lead = require("../models/Lead");
const { sendLeadToMake } = require("../services/makeWebhook");

// Fallback in-memory CRM leads dataset
let inMemoryLeads = [
  {
    id: "LEAD-101",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@example.com",
    property: "The Grand Royale Estate",
    score: 92,
    status: "HOT",
    createdDate: new Date().toISOString(),
  },
  {
    id: "LEAD-102",
    name: "Priya Sharma",
    phone: "+91 94432 10987",
    email: "priya.sharma@example.com",
    property: "Celestial Heights Residency",
    score: 75,
    status: "WARM",
    createdDate: new Date().toISOString(),
  },
  {
    id: "LEAD-103",
    name: "Vikram Sundaram",
    phone: "+91 97890 12345",
    email: "vikram.s@example.com",
    property: "Emerald Palms Villa",
    score: 45,
    status: "COLD",
    createdDate: new Date().toISOString(),
  },
];

// Helper: AI Lead Scoring Algorithm (0 - 100)
const calculateLeadScore = ({ phone, email, date, time, query }) => {
  let score = 40;
  if (phone) score += 20;
  if (email) score += 10;
  if (date || time) score += 25; // High interest: requested scheduled visit
  if (query && query.length > 20) score += 15;
  return Math.min(score, 100);
};

// Get all leads (for CRM Portal)
const getLeads = async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const leads = await Lead.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: leads.length, data: leads });
    }
    res.json({
      success: true,
      count: inMemoryLeads.length,
      data: inMemoryLeads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new lead (Captured from forms/chat)
const createLead = async (req, res) => {
  try {
    const { name, phone, email, property, date, time, query, timeline, location, budget, message, source, notes } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name and Phone are required fields.",
        });
    }

    const score = calculateLeadScore({ phone, email, date, time, query: query || message });
    const leadStatus = score >= 80 ? "HOT" : score >= 60 ? "WARM" : "COLD";
    const leadMessage = message || query || "";

    let savedLead;

    // 1. Save lead to MongoDB (or fallback in-memory CRM)
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      savedLead = await Lead.create({
        name,
        phone,
        email,
        property: property || "General Inquiry",
        date,
        time,
        query: leadMessage,
        score,
        status: leadStatus,
        source: source || "Website Form",
        notes,
      });
    } else {
      savedLead = {
        id: `LEAD-${Date.now()}`,
        name,
        phone,
        email,
        property: property || "General Inquiry",
        date,
        time,
        query: leadMessage,
        score,
        status: leadStatus,
        source: source || "Website Form",
        createdDate: new Date().toISOString(),
      };
      inMemoryLeads.unshift(savedLead);
    }

    // 2. Non-blocking asynchronous dispatch to Make.com Webhook
    sendLeadToMake({
      name,
      email,
      phone,
      property: property || "General Inquiry",
      location,
      message: leadMessage,
      timeline,
      budget,
      source: source || "Website Form",
      date,
      time,
      notes,
    }).catch((err) => {
      console.error("[Make Webhook] Unexpected error in async webhook call:", err.message || err);
    });

    // 3. Return standard successful response to client
    return res.status(201).json({
      success: true,
      message: "Lead captured successfully and scored by AI pipeline.",
      data: savedLead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update lead CRM status
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status field is required." });
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid lead ObjectId format" });
      }
      const updated = await Lead.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );
      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Lead not found" });
      return res.json({ success: true, data: updated });
    }

    const idx = inMemoryLeads.findIndex((l) => l.id === id);
    if (idx === -1)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    inMemoryLeads[idx].status = status;
    res.json({ success: true, data: inMemoryLeads[idx] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete lead
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid lead ObjectId format" });
      }
      const deleted = await Lead.findByIdAndDelete(id);
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "Lead not found" });
      return res.json({ success: true, message: "Lead deleted" });
    }

    inMemoryLeads = inMemoryLeads.filter((l) => l.id !== id);
    res.json({ success: true, message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLeadStatus,
  deleteLead,
};
