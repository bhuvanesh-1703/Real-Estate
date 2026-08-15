const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const {
  getVisits,
  createVisit,
  updateVisitStatus
} = require('../controllers/visitController');

// Public site visit booking
router.post('/', createVisit);

// Admin protected routes
router.get('/', verifyAdmin, getVisits);
router.patch('/:id', verifyAdmin, updateVisitStatus);
router.put('/:id', verifyAdmin, updateVisitStatus);

module.exports = router;
