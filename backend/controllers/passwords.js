const Password = require('../models/Password');

// @desc      Get all passwords
// @route     GET /api/v1/passwords
// @access    Private
exports.getPasswords = async (req, res, next) => {
    try {
        const passwords = await Password.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: passwords.length,
            data: passwords
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc      Create new password
// @route     POST /api/v1/passwords
// @access    Private
exports.createPassword = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const password = await Password.create(req.body);

        res.status(201).json({
            success: true,
            data: password
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Update password
// @route     PUT /api/v1/passwords/:id
// @access    Private
exports.updatePassword = async (req, res, next) => {
    try {
        let password = await Password.findById(req.params.id);

        if (!password) {
            return res.status(404).json({ success: false, error: 'Password not found' });
        }

        // Make sure user owns password
        if (password.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        password = await Password.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: password
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Delete password
// @route     DELETE /api/v1/passwords/:id
// @access    Private
exports.deletePassword = async (req, res, next) => {
    try {
        const password = await Password.findById(req.params.id);

        if (!password) {
            return res.status(404).json({ success: false, error: 'Password not found' });
        }

        // Make sure user owns password
        if (password.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await password.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
