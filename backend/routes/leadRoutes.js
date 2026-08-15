const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const {
  getLeads,
  createLead,
  updateLeadStatus,
  deleteLead
} = require('../controllers/leadController');

// Public lead submission route
router.post('/', createLead);

// Admin protected routes
router.get('/', verifyAdmin, getLeads);
router.patch('/:id', verifyAdmin, updateLeadStatus);
router.put('/:id', verifyAdmin, updateLeadStatus);
router.delete('/:id', verifyAdmin, deleteLead);

module.exports = router;
