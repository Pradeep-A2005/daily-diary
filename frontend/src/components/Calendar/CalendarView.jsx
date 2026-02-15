import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { entriesAPI } from '../../services/api';
import './CalendarView.css';

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    useEffect(() => {
        loadCalendarData();
    }, [year, month]);

    const loadCalendarData = async () => {
        setLoading(true);
        try {
            const response = await entriesAPI.getCalendar(year, month);
            setEntries(response.data);
        } catch (err) {
            console.error('Failed to load calendar data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = () => {
        return new Date(year, month, 0).getDate();
    };

    const getFirstDayOfMonth = () => {
        return new Date(year, month - 1, 1).getDay();
    };

    const getMoodColor = (mood) => {
        const colors = {
            happy: 'var(--mood-happy)',
            neutral: 'var(--mood-neutral)',
            sad: 'var(--mood-sad)',
            angry: 'var(--mood-angry)',
            tired: 'var(--mood-tired)',
        };
        return colors[mood] || 'var(--color-primary)';
    };

    const getEntryForDate = (day) => {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return entries.find((entry) => entry.date === dateStr);
    };

    const handleDayClick = (day) => {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const today = new Date().toISOString().split('T')[0];

        if (dateStr === today) {
            navigate('/entry');
        } else {
            navigate(`/entry/${dateStr}`);
        }
    };

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 2, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month, 1));
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth();
        const firstDay = getFirstDayOfMonth();
        const days = [];
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const entry = getEntryForDate(day);
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${entry ? 'has-entry' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDayClick(day)}
                    style={entry ? { borderColor: getMoodColor(entry.mood) } : {}}
                >
                    <span className="day-number">{day}</span>
                    {entry && (
                        <div
                            className="mood-indicator"
                            style={{ backgroundColor: getMoodColor(entry.mood) }}
                        ></div>
                    )}
                </div>
            );
        }

        return days;
    };

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                    ← Back
                </button>
                <div className="month-navigation">
                    <button onClick={previousMonth} className="btn btn-outline">
                        ←
                    </button>
                    <h2>{monthName}</h2>
                    <button onClick={nextMonth} className="btn btn-outline">
                        →
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="spinner"></div>
            ) : (
                <>
                    <div className="calendar-weekdays">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="weekday">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="calendar-grid">{renderCalendar()}</div>

                    <div className="calendar-legend">
                        <h3>Mood Legend</h3>
                        <div className="legend-items">
                            <div className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: 'var(--mood-happy)' }}></div>
                                <span>Happy</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: 'var(--mood-neutral)' }}></div>
                                <span>Neutral</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: 'var(--mood-sad)' }}></div>
                                <span>Sad</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: 'var(--mood-angry)' }}></div>
                                <span>Angry</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: 'var(--mood-tired)' }}></div>
                                <span>Tired</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CalendarView;
