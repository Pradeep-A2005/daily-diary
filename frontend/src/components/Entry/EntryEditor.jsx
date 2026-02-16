import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const { date } = useParams(); // Get date from URL params

    // Determine if we're viewing a past entry (read-only mode)
    const today = new Date().toISOString().split('T')[0];
    const isViewingPast = date && date !== today;
    const displayDate = date || today;

    const formattedDate = new Date(displayDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        const loadEntry = async () => {
            try {
                let response;
                if (date) {
                    // Load specific date entry
                    response = await entriesAPI.getByDate(date);
                } else {
                    // Load today's entry
                    response = await entriesAPI.getToday();
                }
                setMood(response.data.mood);
                setContent(response.data.content);
            } catch (err) {
                if (err.response?.status !== 404) {
                    setError(isViewingPast ? 'No entry found for this date' : 'Failed to load today\'s entry');
                }
            } finally {
                setLoading(false);
            }
        };

        loadEntry();
    }, [date, isViewingPast]);

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
        }, 2000); // Auto-save after 2 seconds of inactivity

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
                    <h1>{isViewingPast ? 'Past Entry' : 'Today\'s Entry'}</h1>
                    <p className="text-muted">{formattedDate}</p>
                    {isViewingPast && <p className="text-muted" style={{ color: 'var(--color-warning)' }}>📖 Read-only mode</p>}
                </div>
                {!isViewingPast && (
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
                )}
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <MoodSelector selectedMood={mood} onMoodChange={handleMoodChange} disabled={isViewingPast} />

            <div className="editor-container">
                <textarea
                    className="input entry-textarea"
                    placeholder={isViewingPast ? "No entry for this date" : "Write about your day... What happened? How did you feel? What are you grateful for?"}
                    value={content}
                    onChange={handleContentChange}
                    disabled={!mood || isViewingPast}
                />
                {!mood && !isViewingPast && (
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
