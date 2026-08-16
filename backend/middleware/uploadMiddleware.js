const multer = require('multer');

// Store uploaded files in memory buffer before piping to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'images' || file.fieldname === 'image') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WebP) are allowed for property images!'), false);
    }
  } else if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (MP4, WebM) are allowed for property video!'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size limit
  },
  fileFilter
});

const propertyMediaUpload = upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'video', maxCount: 1 }
]);

module.exports = {
  upload,
  propertyMediaUpload
};
