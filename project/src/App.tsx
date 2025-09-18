import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Networking } from './pages/Networking';
import { Events } from './pages/Events';
import { Mentoring } from './pages/Mentoring';
import { Donations } from './pages/Donations';
import { Career } from './pages/Career';
import { Chat } from './components/chat/Chat';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { EventDetails } from './pages/EventDetails';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/networking" element={<Networking />} />
            <Route path="/events" element={<Events />} />
            <Route path="/mentoring" element={<Mentoring />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/career" element={<Career />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/:id" element={<EventDetails />} />
          </Routes>
        </main>
        <Footer />
        <Chat />
      </div>
    </Router>
  );
}

export default App;