// import fs from 'fs';
// import multer from 'multer';
// import path from 'path';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import cloudinary from 'cloudinary';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(__dirname, '../uploads/profile');

//     fs.mkdirSync(uploadDir, { recursive: true });

//     cb(null, uploadDir); 
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024 // 2MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   }
// });

// try {
//   await cloudinary.v2.api.ping();
//   console.log('Cloudinary connected successfully!');
// } catch (error) {
//   console.error('Cloudinary connection failed:', error.message);
//   throw error; 
// }

// const uploadToCloudinary = async (req, res, next) => {
//   if (!req.file) {
//     console.log('No file to upload to Cloudinary');
//     return next();
//   }

//   try {
//     console.log('Uploading to Cloudinary...');
//     const result = await cloudinary.v2.uploader.upload(req.file.path, {
//       folder: 'user-profile-photos'
//     });
    
//     fs.unlinkSync(req.file.path); // Clean up local file
//     // console.log('File uploaded to Cloudinary:', result.secure_url);
    
//     req.cloudinaryUrl = result.secure_url;
//     next();
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     if (req.file?.path) {
//       fs.unlinkSync(req.file.path).catch(console.error);
//     }
//     return res.status(500).json({ 
//       message: 'Error uploading file to Cloudinary',
//       error: error.message 
//     });
//   }
// };


// export { upload, uploadToCloudinary };

import fs from 'fs';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cloudinary from 'cloudinary';

// Load environment variables
dotenv.config();

// ES6 module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validate required environment variables
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000, // 60 seconds timeout
  secure: true, // Always use HTTPS
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/profile');
    
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadDir, { recursive: true });
    
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer with validation
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Test Cloudinary connection at startup
const testCloudinaryConnection = async () => {
  try {
    await cloudinary.v2.api.ping();
    console.log('✅ Cloudinary connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    throw error; 
  }
};

// Retry helper function for uploads
const uploadWithRetry = async (filePath, options, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Upload attempt ${attempt}/${maxRetries}`);
      return await cloudinary.v2.uploader.upload(filePath, options);
    } catch (error) {
      console.log(`Upload attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Function to validate if uploaded image is accessible
const validateImageUrl = async (url, maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        timeout: 10000 // 10 second timeout
      });
      
      if (response.ok) {
        console.log('✅ Image URL is accessible');
        return true;
      }
      
      console.log(`URL validation attempt ${attempt} failed with status: ${response.status}`);
    } catch (error) {
      console.log(`URL validation attempt ${attempt} failed:`, error.message);
    }
    
    if (attempt < maxAttempts) {
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
  
  console.warn('⚠️ Image URL not immediately accessible (might be cached)');
  return false;
};

// Main Cloudinary upload middleware
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    console.log('No file to upload to Cloudinary');
    return next();
  }

  const startTime = Date.now();
  console.log(`📤 Starting upload for file: ${req.file.originalname}`);

  try {
    // Upload with retry logic
    const result = await uploadWithRetry(req.file.path, {
      folder: 'user-profile-photos',
      resource_type: 'image',
      format: 'auto', // Automatically optimize format
      quality: 'auto', // Automatically optimize quality
      unique_filename: true,
      overwrite: false,
    });
    
    // Clean up local file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('🗑️ Local file cleaned up');
    }
    
    const uploadTime = Date.now() - startTime;
    console.log(`✅ File uploaded successfully in ${uploadTime}ms`);
    console.log(`📍 Image URL: ${result.secure_url}`);
    console.log(`🆔 Public ID: ${result.public_id}`);
    
    // Validate the URL is accessible (optional - don't block on failure)
    validateImageUrl(result.secure_url).catch(err => 
      console.warn('URL validation failed:', err.message)
    );
    
    // Store both URL and public_id for future operations
    req.cloudinaryUrl = result.secure_url;
    req.cloudinaryPublicId = result.public_id;
    req.cloudinaryResult = result; // Full result object for additional info
    
    next();
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    
    // Clean up local file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Local file cleaned up after error');
      } catch (cleanupError) {
        console.error('Error cleaning up local file:', cleanupError);
      }
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Error uploading file to Cloudinary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Upload failed'
    });
  }
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    console.log(`🗑️ Image deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Initialize connection test
testCloudinaryConnection().catch(error => {
  console.error('Failed to initialize Cloudinary connection:', error);
});

export { 
  upload, 
  uploadToCloudinary, 
  deleteFromCloudinary,
  testCloudinaryConnection 
};
