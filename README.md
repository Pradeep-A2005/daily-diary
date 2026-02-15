# Daily Diary

A modern, minimal daily diary web application where users can write one entry per day, track their mood, maintain writing streaks, and receive reminders.

## Features

- 📝 **Daily Entries**: Write one entry per day with auto-save functionality
- 😊 **Mood Tracking**: Track your emotions with 5 mood options
- 🔥 **Streak System**: Maintain consecutive writing streaks
- 📅 **Calendar View**: Visual calendar showing all your entries
- 📊 **Mood History**: Chart visualization of mood trends
- 🔔 **Reminders**: Email notifications at 8 PM if you haven't written
- 🔐 **Authentication**: Secure user accounts with JWT

## Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for email notifications
- Node-cron for scheduled tasks

### Frontend
- React with Vite
- React Router for navigation
- Chart.js for mood visualization
- Axios for API calls
- Modern CSS with custom design system

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string
     - `EMAIL_USER`: Your email for sending reminders
     - `EMAIL_PASS`: Your email app password

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Write Entry**: Select your mood and write your daily entry
3. **Auto-Save**: Entries auto-save every 30 seconds
4. **View Calendar**: See all your entries in calendar view
5. **Track Mood**: View mood history charts
6. **Maintain Streak**: Write daily to keep your streak alive
7. **Get Reminders**: Receive email at 8 PM if you haven't written

## Project Structure

```
Daily Diary/
├── backend/
│   ├── config/          # Database and email configuration
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── utils/           # Utility functions (streak calculator)
│   ├── jobs/            # Cron jobs (reminders)
│   └── server.js        # Express server
│
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── context/     # Auth context
    │   ├── services/    # API service layer
    │   └── App.jsx      # Main app component
    └── index.css        # Design system
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Diary Entries
- `POST /api/entries` - Create/update entry
- `GET /api/entries/today` - Get today's entry
- `GET /api/entries/:date` - Get entry by date
- `GET /api/entries` - Get all entries (paginated)
- `GET /api/entries/calendar/:year/:month` - Get calendar data
- `GET /api/entries/mood/history` - Get mood history

## License

MIT
