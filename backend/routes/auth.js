import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Default user ID for single-user mode
const DEFAULT_USER_ID = '000000000000000000000001';

// @route   GET /api/auth/me
// @desc    Get default user info
// @access  Public
router.get('/me', async (req, res) => {
    try {
        let user = await User.findById(DEFAULT_USER_ID).select('-password');

        if (!user) {
            // Create default user if doesn't exist
            user = await User.create({
                _id: DEFAULT_USER_ID,
                email: 'user@dailydiary.com',
                password: 'not-used',
                currentStreak: 0,
                longestStreak: 0,
            });
            user = await User.findById(DEFAULT_USER_ID).select('-password');
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
