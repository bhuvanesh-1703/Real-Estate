import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AIChatModal from './components/AIChatModal';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load administrative pages for bundle optimization
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="w-10 h-10 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-mono text-[#B08D57] uppercase tracking-widest animate-pulse">Loading Aetheria Portal...</span>
  </div>
);

function MainApp() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectProperty = (prop) => {
    setSelectedProperty(prop);
    navigate(`/properties/${prop.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = () => {
    const el = document.getElementById('site-visit');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('site-visit')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1410] flex flex-col font-sans selection:bg-[#B08D57] selection:text-[#0D1410]">
      
      {/* Navbar Header */}
      <Navbar
        onOpenAiChat={() => setIsAiModalOpen(true)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Main View Routes */}
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onSelectProperty={handleSelectProperty}
                  onOpenBooking={handleOpenBooking}
                  onOpenAiChat={() => setIsAiModalOpen(true)}
                />
              }
            />
            <Route
              path="/properties"
              element={
                <Home
                  onSelectProperty={handleSelectProperty}
                  onOpenBooking={handleOpenBooking}
                  onOpenAiChat={() => setIsAiModalOpen(true)}
                />
              }
            />
            <Route
              path="/properties/:slug"
              element={
                <PropertyDetails
                  property={selectedProperty}
                  onOpenBooking={handleOpenBooking}
                  onSelectProperty={handleSelectProperty}
                />
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard initialTab="Overview" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard initialTab="Overview" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard initialTab="Overview" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/properties"
              element={
                <ProtectedRoute>
                  <AdminDashboard initialTab="Property Management" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads"
              element={
                <ProtectedRoute>
                  <AdminDashboard initialTab="Lead Engine" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <AdminDashboard initialTab="Lead Engine" />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Elements */}
      <FloatingWhatsApp
        selectedPropertyTitle={selectedProperty?.title}
      />

      {/* AI Chat Advisor Assistant */}
      <AIChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectProperty={handleSelectProperty}
      />

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}
