import express from 'express';
import mongoose from 'mongoose';
import DiaryEntry from '../models/DiaryEntry.js';
import User from '../models/User.js';
import { updateUserStreak } from '../utils/streakCalculator.js';

const router = express.Router();

// Default user ID for single-user mode (no authentication)
const DEFAULT_USER_ID = new mongoose.Types.ObjectId('000000000000000000000001');

// Initialize default user if not exists
const initDefaultUser = async () => {
    try {
        let user = await User.findById(DEFAULT_USER_ID);
        if (!user) {
            user = await User.create({
                _id: DEFAULT_USER_ID,
                email: 'user@dailydiary.com',
                password: 'not-used',
                currentStreak: 0,
                longestStreak: 0,
            });
            console.log('Default user created successfully');
        }
    } catch (err) {
        console.error('Error initializing default user:', err.message);
    }
};

// Initialize on module load
initDefaultUser();

// @route   POST /api/entries
// @desc    Create or update today's entry
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { content, mood } = req.body;
        const userId = DEFAULT_USER_ID;

        const today = new Date().toISOString().split('T')[0];

        if (!content || !mood) {
            return res.status(400).json({ message: 'Please provide content and mood' });
        }

        if (!['happy', 'neutral', 'sad', 'angry', 'tired'].includes(mood)) {
            return res.status(400).json({ message: 'Invalid mood value' });
        }

        let entry = await DiaryEntry.findOne({ userId, date: today });

        if (entry) {
            entry.content = content;
            entry.mood = mood;
            entry.updatedAt = Date.now();
            await entry.save();
        } else {
            entry = await DiaryEntry.create({
                userId,
                date: today,
                content,
                mood,
            });
        }

        const streakData = await updateUserStreak(userId);

        res.status(201).json({
            entry,
            streak: streakData,
        });
    } catch (error) {
        console.error('Create/Update entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/entries/today
// @desc    Get today's entry
// @access  Public
router.get('/today', async (req, res) => {
    try {
        const userId = DEFAULT_USER_ID;
        const today = new Date().toISOString().split('T')[0];

        const entry = await DiaryEntry.findOne({ userId, date: today });

        if (!entry) {
            return res.status(404).json({ message: 'No entry for today' });
        }

        res.json(entry);
    } catch (error) {
        console.error('Get today entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/entries/:date
// @desc    Get entry by specific date (YYYY-MM-DD)
// @access  Public
router.get('/:date', async (req, res) => {
    try {
        const userId = DEFAULT_USER_ID;
        const { date } = req.params;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
        }

        const entry = await DiaryEntry.findOne({ userId, date });

        if (!entry) {
            return res.status(404).json({ message: 'No entry found for this date' });
        }

        res.json(entry);
    } catch (error) {
        console.error('Get entry by date error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/entries
// @desc    Get all entries for user (paginated)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const userId = DEFAULT_USER_ID;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const entries = await DiaryEntry.find({ userId })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await DiaryEntry.countDocuments({ userId });

        res.json({
            entries,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalEntries: total,
        });
    } catch (error) {
        console.error('Get entries error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/entries/calendar/:year/:month
// @desc    Get entries for calendar view (specific month)
// @access  Public
router.get('/calendar/:year/:month', async (req, res) => {
    try {
        const userId = DEFAULT_USER_ID;
        const { year, month } = req.params;

        const yearNum = parseInt(year);
        const monthNum = parseInt(month);

        if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return res.status(400).json({ message: 'Invalid year or month' });
        }

        const firstDay = `${year}-${month.padStart(2, '0')}-01`;
        const lastDay = new Date(yearNum, monthNum, 0).getDate();
        const lastDayStr = `${year}-${month.padStart(2, '0')}-${lastDay}`;

        const entries = await DiaryEntry.find({
            userId,
            date: { $gte: firstDay, $lte: lastDayStr },
        }).select('date mood');

        res.json(entries);
    } catch (error) {
        console.error('Get calendar entries error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/entries/mood/history
// @desc    Get mood history for chart (last 30 days)
// @access  Public
router.get('/mood/history', async (req, res) => {
    try {
        const userId = DEFAULT_USER_ID;
        const days = parseInt(req.query.days) || 30;

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        const entries = await DiaryEntry.find({
            userId,
            date: { $gte: startDateStr, $lte: endDateStr },
        })
            .select('date mood')
            .sort({ date: 1 });

        res.json(entries);
    } catch (error) {
        console.error('Get mood history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
