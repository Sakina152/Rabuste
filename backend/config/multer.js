import multer from 'multer';
import cloudinaryStoragePkg from 'multer-storage-cloudinary';
const CloudinaryStorage = cloudinaryStoragePkg;
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: { v2: cloudinary },
  params: {
    folder: "rabuste-portfolio", // Changed folder name to be more specific
    allowed_formats: ["png"],    // Restricted to PNG as requested
    transformation: [
      { quality: "auto", fetch_format: "auto" },
    ],
  },
});

const upload = multer({ storage });

export default upload;
