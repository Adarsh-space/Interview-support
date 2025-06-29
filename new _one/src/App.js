import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your page components
import Dashboard from './Pages/Dashboard';
import TestDashboard from './Pages/TestDashboard';
import SupportInterface from './Pages/SupportInterface';
import Setting from './Pages/Setting';
import Sessions from './Pages/Sessions';
import InterviewInterface from './Pages/InterviewInterface';
import CreateSession from './Pages/CreateSession';
import Users from './Pages/Users';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test-dashboard" element={<TestDashboard />} />
          <Route path="/support" element={<SupportInterface />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/interview/:sessionId" element={<InterviewInterface />} />
          <Route path="/create-session" element={<CreateSession />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 