const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a document name']
    },
    type: {
        type: String,
        required: [true, 'Please add a file type'],
        // e.g., PDF, DOCX, IMG
    },
    size: {
        type: String,
        required: [true, 'Please add a file size']
    },
    category: {
        type: String,
        enum: ['Personal', 'Work', 'Finance', 'Medical', 'Legal', 'Other'],
        default: 'Personal'
    },
    fileUrl: {
        type: String,
        // In a real app, this would be an S3 link. 
        // For now, it can be a placeholder or local path.
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Document', DocumentSchema);
