const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

// Public routes
router.get('/', getProperties);
router.get('/:slug', getPropertyBySlug);

// Admin protected routes
router.post('/', verifyAdmin, createProperty);
router.put('/:id', verifyAdmin, updateProperty);
router.delete('/:id', verifyAdmin, deleteProperty);

module.exports = router;
