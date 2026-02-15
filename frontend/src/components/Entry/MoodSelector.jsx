import { useState } from 'react';
import './MoodSelector.css';

const moods = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'sad', emoji: '😔', label: 'Sad' },
    { value: 'angry', emoji: '😡', label: 'Angry' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
];

const MoodSelector = ({ selectedMood, onMoodChange }) => {
    return (
        <div className="mood-selector-container">
            <h3 className="mood-title">How are you feeling today?</h3>
            <div className="mood-selector">
                {moods.map((mood) => (
                    <button
                        key={mood.value}
                        type="button"
                        className={`mood-btn ${selectedMood === mood.value ? 'active' : ''}`}
                        onClick={() => onMoodChange(mood.value)}
                        title={mood.label}
                    >
                        {mood.emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoodSelector;
