import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API (simplified - no actual auth)
export const authAPI = {
    getMe: () => api.get('/auth/me'),
};

// Entries API
export const entriesAPI = {
    createOrUpdate: (content, mood) => api.post('/entries', { content, mood }),
    getToday: () => api.get('/entries/today'),
    getByDate: (date) => api.get(`/entries/${date}`),
    getAll: (page = 1, limit = 10) => api.get(`/entries?page=${page}&limit=${limit}`),
    getCalendar: (year, month) => api.get(`/entries/calendar/${year}/${month}`),
    getMoodHistory: (days = 30) => api.get(`/entries/mood/history?days=${days}`),
};

export default api;
