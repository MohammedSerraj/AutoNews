
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Bookmarks from './pages/BookmarkPage';
import LoginPage from './pages/LoginPage';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import MobileNav from './components/MobileNav';
import { BookmarkProvider } from './context/BookmarkContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';

function SocialCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      window.location.href = '/';
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
        <p className="text-gray-600 italic">Authenticating...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || 
                      location.pathname === '/forgot-password' ||
                      location.pathname === '/reset-password' ||
                      location.pathname.startsWith('/verify-email') || 
                      location.pathname.startsWith('/auth/callback');
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <h1 className="text-2xl font-bold font-nyt-heading mb-2">TangierTimes</h1>
          <p className="text-gray-400 text-xs italic tracking-widest uppercase">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && <Header />}
      
      <main className={`flex-grow ${!isLoginPage ? 'pt-32 pb-16 md:pb-0' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryName" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/verify-email/:id/:hash" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<SocialCallback />} />
        </Routes>
      </main>
      
      {!isLoginPage && <Footer />}
      {!isLoginPage && <MobileNav />}
    </div>
  );
}

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
      <AuthProvider>
        <BookmarkProvider>
          <Router>
            <AppContent />
          </Router>
        </BookmarkProvider>
      </AuthProvider>
    </GoogleReCaptchaProvider>
  );
}

export default App;
