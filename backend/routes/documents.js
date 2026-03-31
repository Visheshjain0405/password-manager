const express = require('express');
const {
    getDocuments,
    createDocument,
    deleteDocument
} = require('../controllers/documents');

const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../config/cloudinary');

router.get('/', protect, getDocuments);
router.post('/', protect, upload.single('file'), createDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
