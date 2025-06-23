import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookCallPage from './pages/BookCallPage';
import BookConsultationPage from './pages/BookConsultationPage';

function App() {
  useEffect(() => {
    // Update document title
    document.title = 'JAG AI Solutions | AI Chat Agents & Intelligent Automation';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book-call" element={<BookCallPage />} />
          <Route path="/book-consultation" element={<BookConsultationPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;