const { upload } = require('../config/cloudinary');

// Middleware to handle multiple image uploads (max 5 images)
const uploadListingImages = upload.array('images', 5);

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB per image.'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 images allowed.'
      });
    }
    
    if (err.message === 'Only image files are allowed!') {
      return res.status(400).json({
        success: false,
        message: 'Only image files (JPG, PNG, WEBP, HEIC) are allowed.'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: err.message || 'Error uploading images'
    });
  }
  
  next();
};

// Middleware to process uploaded files
const processUploadedImages = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    // Extract image data from uploaded files
    req.uploadedImages = req.files.map(file => ({
      url: file.path, // Cloudinary URL
      publicId: file.filename // Cloudinary public_id
    }));
  } else {
    req.uploadedImages = [];
  }
  
  next();
};

module.exports = {
  uploadListingImages,
  handleUploadError,
  processUploadedImages
};
