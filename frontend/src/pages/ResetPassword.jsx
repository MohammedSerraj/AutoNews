
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    password: '',
    password_confirmation: '',
  });
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const email = query.get('email') || '';
    const token = query.get('token') || '';
    
    if (!token) {
      navigate('/login');
    }

    setFormData((prev) => ({ ...prev, email, token }));
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const recaptchaToken = await executeRecaptcha('reset_password');

    const result = await resetPassword({ ...formData, recaptcha_token: recaptchaToken });

    if (result.success) {
      setStatus({ type: 'success', message: result.message });
      // Redirect after success
      setTimeout(() => navigate('/login?reset=success'), 3000);
    } else {
      setStatus({ type: 'error', message: result.errors.email?.[0] || result.errors.password?.[0] || result.errors.message || 'Something went wrong.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-4xl font-nyt-heading font-bold tracking-tighter">TangierTimes</h1>
          </Link>
          <h2 className="text-2xl font-bold font-nyt-heading border-b border-black pb-4 mb-8">Create your new password</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8 italic">
            Enter your new password below. Ensure it is at least 8 characters long.
          </p>
        </div>

        {status && (
          <div className={`mb-6 p-4 text-sm font-medium border ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {status.message}
            {status.type === 'success' && <p className="mt-2 text-xs italic">Redirecting to login...</p>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" value={formData.email} />
          <input type="hidden" value={formData.token} />

          <div>
            <label htmlFor="password" title="New Password" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 focus:border-black outline-none transition-colors text-lg"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label htmlFor="password_confirmation" title="Confirm Password" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Confirm New Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              required
              value={formData.password_confirmation}
              onChange={(e) => setFormData((prev) => ({ ...prev, password_confirmation: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 focus:border-black outline-none transition-colors text-lg"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-bold py-4 hover:bg-gray-800 transition-colors uppercase tracking-widest text-xs disabled:bg-gray-400"
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-12 text-[10px] text-gray-400 leading-relaxed text-center">
          This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
        </div>
      </div>
    </div>
  );
}
