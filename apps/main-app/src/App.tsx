import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivacyCompliance } from '@reiki-goddess/shared-components';
import { SimpleHomePage as HomePage } from './pages/HomePage-simple';
import { SimpleAboutPage as AboutPage } from './pages/AboutPage-simple';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import './App.css';

function App() {
  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Routes>
        
        {/* Global Privacy Compliance */}
        <PrivacyCompliance />
      </div>
    </Router>
  );
}

export default App;