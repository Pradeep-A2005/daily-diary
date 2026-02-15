import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodSelector from './MoodSelector';
import { entriesAPI, authAPI } from '../../services/api';
import './EntryEditor.css';

const EntryEditor = () => {
    const [user, setUser] = useState(null);
    const [mood, setMood] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [error, setError] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    const navigate = useNavigate();

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        const loadTodayEntry = async () => {
            try {
                const response = await entriesAPI.getToday();
                setMood(response.data.mood);
                setContent(response.data.content);
            } catch (err) {
                if (err.response?.status !== 404) {
                    setError('Failed to load today\'s entry');
                }
            } finally {
                setLoading(false);
            }
        };

        loadTodayEntry();
    }, []);

    const saveEntry = useCallback(async () => {
        if (!mood || !content.trim()) {
            return;
        }

        setSaving(true);
        setSaveStatus('Saving...');

        try {
            const response = await entriesAPI.createOrUpdate(content, mood);

            // Update user's streak by fetching fresh user data
            if (response.data.streak) {
                const userResponse = await authAPI.getMe();
                setUser(userResponse.data);
            }

            setSaveStatus('Saved ✓');
            setHasChanges(false);

            setTimeout(() => setSaveStatus(''), 2000);
        } catch (err) {
            setSaveStatus('Failed to save');
            setError(err.response?.data?.message || 'Failed to save entry');
        } finally {
            setSaving(false);
        }
    }, [mood, content]);

    useEffect(() => {
        if (!hasChanges) return;

        const timer = setTimeout(() => {
            saveEntry();
        }, 30000);

        return () => clearTimeout(timer);
    }, [content, mood, hasChanges, saveEntry]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
        setHasChanges(true);
    };

    const handleMoodChange = (newMood) => {
        setMood(newMood);
        setHasChanges(true);
    };

    const handleManualSave = async () => {
        await saveEntry();
    };

    if (loading) {
        return (
            <div className="entry-editor-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="entry-editor-container">
            <div className="entry-header">
                <div>
                    <h1>Today's Entry</h1>
                    <p className="text-muted">{today}</p>
                </div>
                <div className="save-status">
                    {saveStatus && <span className="status-text">{saveStatus}</span>}
                    <button
                        onClick={handleManualSave}
                        className="btn btn-primary"
                        disabled={saving || !mood || !content.trim()}
                    >
                        {saving ? 'Saving...' : 'Save Now'}
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <MoodSelector selectedMood={mood} onMoodChange={handleMoodChange} />

            <div className="editor-container">
                <textarea
                    className="input entry-textarea"
                    placeholder="Write about your day... What happened? How did you feel? What are you grateful for?"
                    value={content}
                    onChange={handleContentChange}
                    disabled={!mood}
                />
                {!mood && (
                    <div className="editor-overlay">
                        <p>Please select your mood first</p>
                    </div>
                )}
            </div>

            <div className="entry-footer">
                <p className="text-muted">
                    {content.length} characters
                </p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default EntryEditor;
