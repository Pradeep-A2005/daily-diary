import { useState } from 'react';
import './MoodSelector.css';

const moods = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'sad', emoji: '😔', label: 'Sad' },
    { value: 'angry', emoji: '😡', label: 'Angry' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
];

const MoodSelector = ({ selectedMood, onMoodChange, disabled = false }) => {
    return (
        <div className="mood-selector-container">
            <h3 className="mood-title">{disabled ? 'Mood on this day:' : 'How are you feeling today?'}</h3>
            <div className="mood-selector">
                {moods.map((mood) => (
                    <button
                        key={mood.value}
                        type="button"
                        className={`mood-btn ${selectedMood === mood.value ? 'active' : ''}`}
                        onClick={() => !disabled && onMoodChange(mood.value)}
                        title={mood.label}
                        disabled={disabled}
                        style={disabled ? { cursor: 'not-allowed', opacity: selectedMood === mood.value ? 1 : 0.5 } : {}}
                    >
                        {mood.emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoodSelector;
