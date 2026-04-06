
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

export default function VerifyEmail() {
  const { id, hash } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email address...');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      // Reconstruct the signed URL signature/expires if needed, 
      // but typically Laravel just needs the id and hash in the path.
      const expires = searchParams.get('expires');
      const signature = searchParams.get('signature');

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. The link may have expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification.');
      }
    };

    verify();
  }, [id, hash, searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 text-center shadow-sm">
        <h2 className="text-2xl font-bold font-nyt-heading mb-4">Email Verification</h2>
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
            <p className="text-gray-600 italic">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-green-600 mb-4 text-4xl">✓</div>
            <p className="text-gray-800 font-medium mb-2">{message}</p>
            <p className="text-gray-500 text-sm italic">Redirecting to login...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-red-600 mb-4 text-4xl">!</div>
            <p className="text-gray-800 font-medium mb-4">{message}</p>
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
