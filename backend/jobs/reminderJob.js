import cron from 'node-cron';
import User from '../models/User.js';
import DiaryEntry from '../models/DiaryEntry.js';
import { sendReminderEmail } from '../config/email.js';

/**
 * Cron job that runs daily at 8:00 PM to send reminders
 * to users who haven't written their diary entry today
 */
export const startReminderJob = () => {
    // Run at 8:00 PM every day (20:00)
    // Cron format: minute hour day month weekday
    cron.schedule('0 20 * * *', async () => {
        console.log('Running daily reminder job at 8:00 PM...');

        try {
            const today = new Date().toISOString().split('T')[0];

            // Get all users
            const users = await User.find({}).select('_id email');

            for (const user of users) {
                // Check if user has written today
                const todayEntry = await DiaryEntry.findOne({
                    userId: user._id,
                    date: today,
                });

                // If no entry for today, send reminder
                if (!todayEntry) {
                    await sendReminderEmail(user.email, user.email.split('@')[0]);
                    console.log(`Reminder sent to ${user.email}`);
                }
            }

            console.log('Daily reminder job completed');
        } catch (error) {
            console.error('Error in reminder job:', error);
        }
    });

    console.log('Reminder job scheduled for 8:00 PM daily');
};

/**
 * Manual trigger for testing reminders
 * Can be called via API endpoint for testing
 */
export const sendTestReminders = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const users = await User.find({}).select('_id email');

        let sentCount = 0;

        for (const user of users) {
            const todayEntry = await DiaryEntry.findOne({
                userId: user._id,
                date: today,
            });

            if (!todayEntry) {
                await sendReminderEmail(user.email, user.email.split('@')[0]);
                sentCount++;
            }
        }

        return { message: `Sent ${sentCount} reminder emails`, count: sentCount };
    } catch (error) {
        console.error('Error sending test reminders:', error);
        throw error;
    }
};
