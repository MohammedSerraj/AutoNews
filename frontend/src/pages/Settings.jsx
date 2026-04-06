
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, updateProfile, updatePassword, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [profileStatus, setProfileStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
    if (user) {
      setProfileData({ name: user.name, email: user.email });
    }
  }, [user, isAuthenticated, loading, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileSubmitting(true);
    setProfileStatus(null);

    const result = await updateProfile(profileData);
    if (result.success) {
      setProfileStatus({ type: 'success', message: result.message });
    } else {
      setProfileStatus({ type: 'error', message: result.errors?.message || 'Failed to update profile.' });
    }
    setIsProfileSubmitting(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsPasswordSubmitting(true);
    setPasswordStatus(null);

    const result = await updatePassword(passwordData);
    if (result.success) {
      setPasswordStatus({ type: 'success', message: result.message });
      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
    } else {
      setPasswordStatus({ type: 'error', message: result.errors?.message || Object.values(result.errors || {})[0]?.[0] || 'Failed to update password.' });
    }
    setIsPasswordSubmitting(false);
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-nyt-heading font-bold mb-8 pb-4 border-b-2 border-black">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column: Sidebar-like info */}
        <div className="md:col-span-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 pt-1">Profile Information</h2>
          <p className="text-sm text-gray-600 italic leading-relaxed">
            Update your account's profile information and email address. You may need to re-verify your email if you change it.
          </p>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-16">
          {/* Profile Form */}
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {profileStatus && (
              <div className={`p-4 text-sm font-medium border ${
                profileStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                {profileStatus.message}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Display Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black outline-none transition-colors text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black outline-none transition-colors text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={isProfileSubmitting}
              className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {isProfileSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          {/* Password Form */}
          <div className="pt-12 border-t border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 pt-1">Security & Password</h2>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {passwordStatus && (
                <div className={`p-4 text-sm font-medium border ${
                  passwordStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {passwordStatus.message}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black outline-none transition-colors text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black outline-none transition-colors text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.password_confirmation}
                  onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black outline-none transition-colors text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={isPasswordSubmitting}
                className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isPasswordSubmitting ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
