const Document = require('../models/Document');

// @desc      Get all documents
// @route     GET /api/v1/documents
// @access    Private
exports.getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc      Create new document
// @route     POST /api/v1/documents
// @access    Private
exports.createDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a file' });
        }

        const { name, category } = req.body;

        const document = await Document.create({
            user: req.user.id,
            name: name || req.file.originalname,
            type: req.file.mimetype.split('/')[1].toUpperCase(),
            size: (req.file.size / 1024).toFixed(2) + ' KB',
            category: category || 'Personal',
            fileUrl: req.file.path // Cloudinary URL
        });

        res.status(201).json({
            success: true,
            data: document
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Delete document
// @route     DELETE /api/v1/documents/:id
// @access    Private
exports.deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ success: false, error: 'Document not found' });
        }

        if (document.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await document.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
