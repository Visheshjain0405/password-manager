const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        // Validate email & password
        if (!email || !password) {
            console.log('Login failed: Missing email or password');
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('Login failed: User not found');
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            console.log('Login failed: Password mismatch');
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        /* --- 2FA Step (DISABLED) ---
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        // Send Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Login OTP for SecurePass',
                message: `Your login OTP is: ${otp}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
                        <h2 style="color: #4666f1; text-align: center;">2FA Verification</h2>
                        <p>Hello <strong>${user.name}</strong>,</p>
                        <p>A login attempt was made using your password. Please use the following OTP to complete the verification:</p>
                        <div style="background: #f5f7ff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4666f1;">${otp}</span>
                        </div>
                        <p style="font-size: 14px; color: #555;">This code will expire in 10 minutes. If this wasn't you, please change your password immediately.</p>
                    </div>
                `,
            });

            return res.status(200).json({
                success: true,
                requires2FA: true,
                message: 'OTP sent to your email for verification'
            });
        } catch (err) {
            user.otp = undefined;
            user.otpExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, error: 'Failed to send verification email' });
        }
        */

        // Directly send token and skip 2FA
        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc      Send OTP to email
// @route     POST /api/v1/auth/send-otp
// @access    Public
exports.sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Please provide an email' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: 'No user found with that email' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP and expire on user
        user.otp = otp;
        user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        // Send email
        const message = `Your login OTP is: ${otp}. It will expire in 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Login OTP for SecurePass',
                message,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
                        <h2 style="color: #4666f1; text-align: center;">SecurePass Login</h2>
                        <p>Hello <strong>${user.name}</strong>,</p>
                        <p>You requested a login OTP. Please use the following code to access your vault:</p>
                        <div style="background: #f5f7ff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4666f1;">${otp}</span>
                        </div>
                        <p style="font-size: 14px; color: #555;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">SecurePass Vault Security Team</p>
                    </div>
                `,
            });

            res.status(200).json({ success: true, data: 'OTP sent to email' });
        } catch (err) {
            user.otp = undefined;
            user.otpExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, error: 'Email could not be sent' });
        }
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc      Verify OTP and Login
// @route     POST /api/v1/auth/verify-otp
// @access    Public
exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, error: 'Please provide email and OTP' });
        }

        const user = await User.findOne({ email }).select('+otp');

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if OTP matches and is not expired
        if (user.otp !== otp || Date.now() > user.otpExpire) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        // Clear OTP fields
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    res
        .status(statusCode)
        // .cookie('token', token, options) // We'll stick to returning json for now
        .json({
            success: true,
            token
        });
};
