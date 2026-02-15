import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import EntryEditor from './components/Entry/EntryEditor';
import CalendarView from './components/Calendar/CalendarView';
import MoodChart from './components/Mood/MoodChart';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* All routes are now public - no authentication */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entry" element={<EntryEditor />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/mood-history" element={<MoodChart />} />

        {/* Default Route - go straight to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
