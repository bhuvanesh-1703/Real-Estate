const express = require('express');
const router = express.Router();
const {
  getVisits,
  createVisit,
  updateVisitStatus
} = require('../controllers/visitController');

router.get('/', getVisits);
router.post('/', createVisit);
router.patch('/:id', updateVisitStatus);

module.exports = router;
