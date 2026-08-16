const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const { propertyMediaUpload } = require('../middleware/uploadMiddleware');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  patchPropertyStatus,
  deleteProperty,
  uploadMedia
} = require('../controllers/propertyController');

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Admin protected routes (Role-based access)
router.post('/upload-media', verifyAdmin, propertyMediaUpload, uploadMedia);
router.post('/', verifyAdmin, propertyMediaUpload, createProperty);
router.put('/:id', verifyAdmin, propertyMediaUpload, updateProperty);
router.patch('/:id/status', verifyAdmin, patchPropertyStatus);
router.delete('/:id', verifyAdmin, deleteProperty);

module.exports = router;
