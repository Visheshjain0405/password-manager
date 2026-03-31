const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Check if the file is a PDF
        const isPDF = file.mimetype === 'application/pdf';

        return {
            folder: 'secure_vault_documents',
            // If it's a PDF, we want 'raw'. Otherwise, 'auto' is fine for images.
            resource_type: isPDF ? 'raw' : 'auto',
            type: 'upload',
            // This ensures the filename stays recognizable in the URL
            // For PDFs, including the extension is crucial for the browser to open it as a PDF
            public_id: isPDF ? file.originalname : file.originalname.split('.')[0]
        };
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

module.exports = upload;
