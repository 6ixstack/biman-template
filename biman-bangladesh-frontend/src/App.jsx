import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Book from './pages/Book';
import Manage from './pages/Manage';
import CheckIn from './pages/CheckIn';
import FlightStatus from './pages/FlightStatus';

function App() {
  return (
    <Router basename="/biman-template">
      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Book />} />
            <Route path="/booking-confirmation" element={<Home />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/flight-status" element={<FlightStatus />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 