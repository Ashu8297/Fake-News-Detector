import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AIChatDrawer from './components/AIChatDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthLandingPage from './pages/AuthLandingPage';
import LandingPage from './pages/LandingPage';
import PredictPage from './pages/PredictPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

function AppContent() {
  const [activePage, setActivePage] = useState('auth');
  const [isDark, setIsDark] = useState(true);
  const [preloadedText, setPreloadedText] = useState('');
  const [toast, setToast] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (!loading && !user && !['auth', 'login', 'register', 'forgot-password'].includes(activePage)) {
      setActivePage('auth');
    }
  }, [loading, user, activePage]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'auth':
        return <AuthLandingPage setActivePage={setActivePage} />;
      case 'home':
        return <LandingPage setActivePage={setActivePage} setPreloadedText={setPreloadedText} />;
      case 'predict':
        return (
          <PredictPage
            preloadedText={preloadedText}
            setPreloadedText={setPreloadedText}
            showToast={showToast}
          />
        );
      case 'dashboard':
        return <DashboardPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'history':
        return <HistoryPage showToast={showToast} />;
      case 'about':
        return <AboutPage />;
      case 'profile':
        return <ProfilePage setActivePage={setActivePage} />;
      case 'settings':
        return <SettingsPage setActivePage={setActivePage} showToast={showToast} />;
      case 'admin':
        return (
          <ProtectedRoute requiredRole="admin" setActivePage={setActivePage}>
            <AdminDashboardPage />
          </ProtectedRoute>
        );
      case 'login':
        return <LoginPage setActivePage={setActivePage} showToast={showToast} />;
      case 'register':
        return <RegisterPage setActivePage={setActivePage} showToast={showToast} />;
      case 'forgot-password':
        return <ForgotPasswordPage setActivePage={setActivePage} showToast={showToast} />;
      default:
        return <NotFoundPage setActivePage={setActivePage} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0b0f19]">
        <LoadingScreen message="Verifying authentication credentials..." />
      </div>
    );
  }

  if (!user) {
    return renderPage();
  }

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300">
      <div>
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          isDark={isDark}
          setIsDark={setIsDark}
          toggleChat={() => setIsChatOpen(!isChatOpen)}
          currentUser={user}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          {renderPage()}
        </main>
      </div>

      <Footer setActivePage={setActivePage} />

      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
