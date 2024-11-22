import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PlayerProvider } from './contexts/PlayerContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseForm from './pages/CourseForm';
import VideoUpload from './pages/VideoUpload';
import PlayerCustomization from './pages/PlayerCustomization';

const App = () => {
  return (
    <AnalyticsProvider>
      <PlayerProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses/new" element={<CourseForm />} />
              <Route path="/courses/:id/edit" element={<CourseForm />} />
              <Route path="/lessons/:id/video" element={<VideoUpload />} />
              <Route path="/player-settings" element={<PlayerCustomization />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </PlayerProvider>
    </AnalyticsProvider>
  );
};

export default App;