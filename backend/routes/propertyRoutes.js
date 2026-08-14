const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

router.get('/', getProperties);
router.get('/:slug', getPropertyBySlug);
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

module.exports = router;
