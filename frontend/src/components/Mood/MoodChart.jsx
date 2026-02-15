import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { entriesAPI } from '../../services/api';
import './MoodChart.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MoodChart = () => {
    const [moodData, setMoodData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);
    const navigate = useNavigate();

    useEffect(() => {
        loadMoodHistory();
    }, [days]);

    const loadMoodHistory = async () => {
        setLoading(true);
        try {
            const response = await entriesAPI.getMoodHistory(days);
            setMoodData(response.data);
        } catch (err) {
            console.error('Failed to load mood history:', err);
        } finally {
            setLoading(false);
        }
    };

    const getMoodValue = (mood) => {
        const moodValues = {
            happy: 5,
            neutral: 3,
            sad: 2,
            angry: 1,
            tired: 2.5,
        };
        return moodValues[mood] || 3;
    };

    const getMoodColor = (mood) => {
        const colors = {
            happy: '#fbbf24',
            neutral: '#60a5fa',
            sad: '#a78bfa',
            angry: '#f87171',
            tired: '#94a3b8',
        };
        return colors[mood] || '#60a5fa';
    };

    const chartData = {
        labels: moodData.map((entry) => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
            {
                label: 'Mood',
                data: moodData.map((entry) => getMoodValue(entry.mood)),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                pointBackgroundColor: moodData.map((entry) => getMoodColor(entry.mood)),
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const mood = moodData[context.dataIndex].mood;
                        return mood.charAt(0).toUpperCase() + mood.slice(1);
                    },
                },
            },
        },
        scales: {
            y: {
                min: 0,
                max: 6,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        const labels = ['', 'Angry', 'Sad', 'Neutral', '', 'Happy'];
                        return labels[value] || '';
                    },
                },
            },
        },
    };

    return (
        <div className="mood-chart-container">
            <div className="mood-chart-header">
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                    ← Back
                </button>
                <h1>Mood History</h1>
            </div>

            <div className="time-range-selector">
                <button
                    onClick={() => setDays(7)}
                    className={`btn ${days === 7 ? 'btn-primary' : 'btn-outline'}`}
                >
                    7 Days
                </button>
                <button
                    onClick={() => setDays(30)}
                    className={`btn ${days === 30 ? 'btn-primary' : 'btn-outline'}`}
                >
                    30 Days
                </button>
                <button
                    onClick={() => setDays(90)}
                    className={`btn ${days === 90 ? 'btn-primary' : 'btn-outline'}`}
                >
                    90 Days
                </button>
            </div>

            {loading ? (
                <div className="spinner"></div>
            ) : moodData.length === 0 ? (
                <div className="card empty-state">
                    <h2>No mood data yet</h2>
                    <p className="text-muted">Start writing entries to track your mood over time</p>
                    <button onClick={() => navigate('/entry')} className="btn btn-primary mt-lg">
                        Write Entry
                    </button>
                </div>
            ) : (
                <>
                    <div className="chart-container card">
                        <Line data={chartData} options={chartOptions} />
                    </div>

                    <div className="mood-stats">
                        <div className="stat-card card">
                            <h3>Total Entries</h3>
                            <div className="stat-number">{moodData.length}</div>
                        </div>
                        <div className="stat-card card">
                            <h3>Most Common Mood</h3>
                            <div className="stat-number">
                                {(() => {
                                    const moodCounts = moodData.reduce((acc, entry) => {
                                        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                                        return acc;
                                    }, {});
                                    const mostCommon = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
                                    return mostCommon ? mostCommon[0].charAt(0).toUpperCase() + mostCommon[0].slice(1) : 'N/A';
                                })()}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MoodChart;
