import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, entriesAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [todayEntry, setTodayEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load user data
                const userResponse = await authAPI.getMe();
                setUser(userResponse.data);

                // Load today's entry
                try {
                    const entryResponse = await entriesAPI.getToday();
                    setTodayEntry(entryResponse.data);
                } catch (err) {
                    setTodayEntry(null);
                }
            } catch (err) {
                console.error('Failed to load data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getMoodEmoji = (mood) => {
        const moodMap = {
            happy: '😊',
            neutral: '😐',
            sad: '😔',
            angry: '😡',
            tired: '😴',
        };
        return moodMap[mood] || '😐';
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-content">
                        <h1>📝 Daily Diary</h1>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="container">
                    {/* Streak Display */}
                    <div className="streak-container">
                        <div className="streak-card">
                            <div className="streak-number">{user?.currentStreak || 0}</div>
                            <div className="streak-label">Current Streak</div>
                        </div>
                        <div className="streak-card">
                            <div className="streak-number">{user?.longestStreak || 0}</div>
                            <div className="streak-label">Longest Streak</div>
                        </div>
                    </div>

                    {/* Today's Entry Status */}
                    <div className="today-section">
                        {loading ? (
                            <div className="spinner"></div>
                        ) : todayEntry ? (
                            <div className="card today-card">
                                <div className="today-header">
                                    <h2>Today's Entry {getMoodEmoji(todayEntry.mood)}</h2>
                                    <button
                                        onClick={() => navigate('/entry')}
                                        className="btn btn-outline"
                                    >
                                        Edit Entry
                                    </button>
                                </div>
                                <p className="entry-preview">{todayEntry.content.substring(0, 200)}...</p>
                            </div>
                        ) : (
                            <div className="card empty-state">
                                <h2>You haven't written today</h2>
                                <p className="text-muted">
                                    Start your entry now to keep your streak alive!
                                </p>
                                <button
                                    onClick={() => navigate('/entry')}
                                    className="btn btn-primary mt-lg"
                                >
                                    Write Today's Entry
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <button
                            onClick={() => navigate('/calendar')}
                            className="action-card card"
                        >
                            <span className="action-icon">📅</span>
                            <h3>Calendar View</h3>
                            <p className="text-muted">See all your entries</p>
                        </button>

                        <button
                            onClick={() => navigate('/mood-history')}
                            className="action-card card"
                        >
                            <span className="action-icon">📊</span>
                            <h3>Mood History</h3>
                            <p className="text-muted">Track your emotions</p>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
