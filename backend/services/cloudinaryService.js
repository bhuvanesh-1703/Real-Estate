const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Upload Image Buffer to Cloudinary
 */
const uploadImageToCloudinary = (buffer, folder = 'real-estate/images') => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing.'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Upload Video Buffer to Cloudinary with mandatory <= 15 seconds validation
 */
const uploadVideoToCloudinary = (buffer, folder = 'real-estate/videos') => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error('Cloudinary environment variables are missing.'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'video',
        allowed_formats: ['mp4', 'webm', 'mov']
      },
      async (error, result) => {
        if (error) return reject(error);

        const durationInSeconds = result.duration || 0;

        // Strict Backend Validation: Reject videos exceeding 15 seconds
        if (durationInSeconds > 15.5) {
          console.warn(`[Cloudinary Upload Rejection] Video duration ${durationInSeconds}s exceeds maximum 15s limit. Destroying asset...`);
          try {
            await cloudinary.uploader.destroy(result.public_id, { resource_type: 'video' });
          } catch (cleanupErr) {
            console.error('[Cloudinary Cleanup Error]:', cleanupErr.message);
          }
          return reject(new Error(`Video duration (${Math.round(durationInSeconds)}s) exceeds maximum allowed duration of 15 seconds.`));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          duration: Math.round(durationInSeconds)
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Destroy Cloudinary Asset (Image or Video)
 */
const destroyCloudinaryAsset = async (publicId, resourceType = 'image') => {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    const res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`[Cloudinary Asset Destroyed] Public ID: ${publicId}, Result: ${res.result}`);
    return res;
  } catch (error) {
    console.error(`[Cloudinary Destroy Error] Failed to destroy asset ${publicId}:`, error.message);
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
  destroyCloudinaryAsset
};
