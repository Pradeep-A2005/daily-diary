import mongoose from 'mongoose';

const diaryEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    mood: {
        type: String,
        enum: ['happy', 'neutral', 'sad', 'angry', 'tired'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to ensure one entry per day per user
diaryEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

// Auto-update the updatedAt field
diaryEntrySchema.pre('save', async function () {
    this.updatedAt = Date.now();
});

const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema);

export default DiaryEntry;
