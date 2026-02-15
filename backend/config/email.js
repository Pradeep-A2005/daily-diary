import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendReminderEmail = async (userEmail, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: '📝 Daily Diary Reminder',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Don't Break Your Streak! ✨</h2>
          <p>Hi ${userName || 'there'},</p>
          <p>You haven't written in your diary today. Keep your streak alive!</p>
          <p>Take a moment to reflect on your day and jot down your thoughts.</p>
          <a href="http://localhost:3000" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            Write Now
          </a>
          <p style="margin-top: 24px; color: #666; font-size: 14px;">
            This is an automated reminder from Daily Diary.
          </p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${userEmail}`);
    } catch (error) {
        console.error(`Failed to send email to ${userEmail}:`, error);
    }
};

export default transporter;
