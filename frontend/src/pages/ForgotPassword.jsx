
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const token = await executeRecaptcha('forgot_password');

    const result = await forgotPassword(email, token);
    
    if (result.success) {
      setStatus({ type: 'success', message: result.message });
      setEmail('');
    } else {
      setStatus({ type: 'error', message: result.errors.email?.[0] || result.errors.message || 'Something went wrong.' });
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
          <h2 className="text-2xl font-bold font-nyt-heading border-b border-black pb-4 mb-8">Reset your password</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Tell us the email address associated with your account, and we’ll send you a link to reset your password.
          </p>
        </div>

        {status && (
          <div className={`mb-6 p-4 text-sm font-medium border ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-black outline-none transition-colors text-lg"
              placeholder="name@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-bold py-4 hover:bg-gray-800 transition-colors uppercase tracking-widest text-xs disabled:bg-gray-400"
          >
            {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <Link to="/login" className="text-xs font-bold uppercase tracking-widest hover:underline">
            Return to Log In
          </Link>
        </div>

        <div className="mt-12 text-[10px] text-gray-400 leading-relaxed text-center">
          This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
        </div>
      </div>
    </div>
  );
}
