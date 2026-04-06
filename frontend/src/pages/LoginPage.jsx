
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      setMessage('Your email has been verified successfully! You can now sign in.');
      setIsLogin(true);
      // Clear the query param from URL without refreshing
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    if (!executeRecaptcha) {
      setErrors({ message: 'reCAPTCHA not yet available. Please try again in a moment.' });
      return;
    }

    setIsLoading(true);

    try {
      const token = await executeRecaptcha(isLogin ? 'login' : 'signup');

      if (isLogin) {
        const result = await login(formData.email, formData.password, token);
        if (result.success) {
          navigate('/');
        } else {
          setErrors(result.errors);
        }
      } else {
        if (!acceptedTerms) return;
        const result = await register(formData.name, formData.email, formData.password, token);
        if (result.success) {
          setMessage(result.message || 'Registration successful! Please check your email.');
        } else {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      console.error('reCAPTCHA Error:', error);
      setErrors({ message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://127.0.0.1:8000/api/auth/${provider}/redirect`;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
        <div className="max-w-md w-full mx-auto">

          {/* Logo */}
          <Link to="/" className="inline-block mb-12 group">
            <h2 className="text-2xl font-bold font-nyt-heading tracking-tight group-hover:opacity-70 transition-opacity">
              TangierTimes
            </h2>
            <p className="text-xs text-gray-400 italic mt-0.5">Morocco's Premier English Daily</p>
          </Link>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold font-nyt-heading mb-3 leading-tight">
              {isLogin ? 'Welcome Back' : 'Join TangierTimes'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isLogin
                ? 'Sign in to access your personalized news feed.'
                : 'Create an account and stay informed about Morocco.'}
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm font-medium border border-green-100 italic">
              {message}
            </div>
          )}
          {errors.message && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium border border-red-100 italic">
              {errors.message}
            </div>
          )}
          {errors.recaptcha_token && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium border border-red-100 italic">
              {errors.recaptcha_token[0]}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3.5 border ${errors.name ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all text-sm disabled:opacity-50`}
                  placeholder="John Doe"
                  required={!isLogin}
                />
                {errors.name && <p className="mt-1 text-[10px] text-red-500 italic">{errors.name[0]}</p>}
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-3.5 border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all text-sm disabled:opacity-50`}
                placeholder="name@email.com"
                required
              />
              {errors.email && <p className="mt-1 text-[10px] text-red-500 italic">{errors.email[0]}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3.5 pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all text-sm disabled:opacity-50`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors disabled:pointer-events-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[10px] text-red-500 italic">{errors.password[0]}</p>}
              {isLogin && (
                <Link to="/forgot-password" title="Forgot Password" className="inline-block mt-2 text-[10px] text-gray-400 hover:text-black uppercase tracking-wider font-bold transition-colors">
                  Forgot password?
                </Link>
              )}
            </div>

            {/* Terms checkbox — only on signup */}
            {!isLogin && (
              <label className={`flex items-start space-x-3 cursor-pointer group ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    disabled={isLoading}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 flex items-center justify-center transition-all ${
                    acceptedTerms ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-500'
                  }`}>
                    {acceptedTerms && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-black font-bold hover:underline underline-offset-2">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-black font-bold hover:underline underline-offset-2">Privacy Policy</Link>
                  {' '}of TangierTimes.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={(!isLogin && !acceptedTerms) || isLoading}
              className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase text-xs hover:bg-gray-800 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-150"></div>
            </div>
            <span className="relative px-4 bg-white text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Or continue with
            </span>
          </div>

          {/* Social Logins */}
          <div className="flex justify-center">
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2.5 py-4 px-12 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-sm font-semibold group disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Toggle */}
          <p className="mt-10 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-black hover:underline underline-offset-4"
            >
              {isLogin ? 'Sign Up Free' : 'Sign In'}
            </button>
          </p>

          {/* reCAPTCHA Compliance Text */}
          <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Privacy Policy</a>{' '}
            and{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Terms of Service</a>{' '}
            apply.
          </p>
        </div>
      </div>

      {/* Right Side: Image Hero */}
      <div className="hidden lg:block w-1/2 relative bg-gray-900 overflow-hidden">
        <img
          src="https://i.ibb.co/HTpN3pDH/33cdbf5f43d09df0524c32ce26fa23f3.jpg"
          alt="TangierTimes Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          {/* Top Label */}
          <div>
            <span className="inline-block border border-white/30 text-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              Est. 2026 · Tangier, Morocco
            </span>
          </div>

          {/* Main Hero Content */}
          <div className="max-w-lg">
            <div className="w-12 h-0.5 bg-white/50 mb-8"></div>
            <h2 className="text-5xl font-bold font-nyt-heading leading-[1.1] mb-6">
              "The truth is rarely pure and never simple."
            </h2>
            <p className="text-white/60 text-sm italic">— Oscar Wilde</p>
            <div className="w-12 h-0.5 bg-white/20 mt-8 mb-8"></div>
            <p className="text-white/70 text-base leading-relaxed">
              Join thousands of readers who trust TangierTimes for informed, balanced reporting from across Morocco and the world.
            </p>
          </div>

          {/* Bottom Footer Section */}
          <div className="flex justify-between items-center text-[10px] text-white/30 tracking-widest uppercase">
            <p>© 2026 TangierTimes</p>
            <div className="flex space-x-4">
              <span>Twitter</span>
              <span>Instagram</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
