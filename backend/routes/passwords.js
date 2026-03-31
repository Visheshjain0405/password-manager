const express = require('express');
const {
    getPasswords,
    createPassword,
    updatePassword,
    deletePassword
} = require('../controllers/passwords');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, getPasswords);
router.post('/', protect, createPassword);
router.put('/:id', protect, updatePassword);
router.delete('/:id', protect, deletePassword);

module.exports = router;
