import DiaryEntry from '../models/DiaryEntry.js';
import User from '../models/User.js';

/**
 * Calculate current streak and longest streak for a user
 * @param {String} userId - User ID
 * @returns {Object} { currentStreak, longestStreak }
 */
export const calculateStreak = async (userId) => {
    try {
        // Get all entries for user, sorted by date descending
        const entries = await DiaryEntry.find({ userId })
            .sort({ date: -1 })
            .select('date');

        if (entries.length === 0) {
            return { currentStreak: 0, longestStreak: 0 };
        }

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Check if there's an entry for today or yesterday to start counting
        const latestEntryDate = new Date(entries[0].date);
        const daysDiff = Math.floor((today - latestEntryDate) / (1000 * 60 * 60 * 24));

        // If latest entry is more than 1 day old, streak is broken
        if (daysDiff > 1) {
            currentStreak = 0;
        } else {
            // Count consecutive days
            let expectedDate = new Date(entries[0].date);

            for (let i = 0; i < entries.length; i++) {
                const entryDate = new Date(entries[i].date);
                const entryDateStr = entryDate.toISOString().split('T')[0];
                const expectedDateStr = expectedDate.toISOString().split('T')[0];

                if (entryDateStr === expectedDateStr) {
                    tempStreak++;
                    if (i === 0 || daysDiff <= 1) {
                        currentStreak = tempStreak;
                    }
                    if (tempStreak > longestStreak) {
                        longestStreak = tempStreak;
                    }
                    // Move to previous day
                    expectedDate.setDate(expectedDate.getDate() - 1);
                } else {
                    // Streak broken
                    if (tempStreak > longestStreak) {
                        longestStreak = tempStreak;
                    }
                    tempStreak = 1;
                    expectedDate = new Date(entryDate);
                    expectedDate.setDate(expectedDate.getDate() - 1);
                }
            }
        }

        // Final check for longest streak
        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }

        return { currentStreak, longestStreak };
    } catch (error) {
        console.error('Error calculating streak:', error);
        return { currentStreak: 0, longestStreak: 0 };
    }
};

/**
 * Update user's streak in database
 * @param {String} userId - User ID
 */
export const updateUserStreak = async (userId) => {
    try {
        const { currentStreak, longestStreak } = await calculateStreak(userId);

        await User.findByIdAndUpdate(userId, {
            currentStreak,
            longestStreak,
        });

        return { currentStreak, longestStreak };
    } catch (error) {
        console.error('Error updating user streak:', error);
        throw error;
    }
};
