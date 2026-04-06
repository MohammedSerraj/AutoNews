
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async (authToken = token) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, recaptchaToken) => {
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password, recaptcha_token: recaptchaToken }),
    });

    const data = await response.json();

    if (response.ok) {
      setToken(data.access_token);
      localStorage.setItem('auth_token', data.access_token);
      setUser(data.user);
      return { success: true };
    } else {
      return { success: false, errors: data.errors || { message: data.message } };
    }
  };

  const register = async (name, email, password, recaptchaToken) => {
    const response = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ name, email, password, recaptcha_token: recaptchaToken }),
    });

    const data = await response.json();

    if (response.ok) {
      setToken(data.access_token);
      localStorage.setItem('auth_token', data.access_token);
      setUser(data.user);
      return { success: true, message: data.message };
    } else {
      return { success: false, errors: data.errors || { message: data.message } };
    }
  };

  const logout = async () => {
    if (token) {
      await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const forgotPassword = async (email, recaptchaToken) => {
    const response = await fetch('http://127.0.0.1:8000/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, recaptcha_token: recaptchaToken }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, errors: data.errors || { message: data.message } };
    }
  };

  const resetPassword = async (formData) => {
    const response = await fetch('http://127.0.0.1:8000/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, errors: data.errors || { message: data.message } };
    }
  };

  const updateProfile = async (profileData) => {
    const response = await fetch('http://127.0.0.1:8000/api/profile/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      return { success: true, message: data.message };
    } else {
      return { success: false, errors: data.errors || { message: data.message } };
    }
  };

  const updatePassword = async (passwordData) => {
    const response = await fetch('http://127.0.0.1:8000/api/profile/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, errors: data.errors || { message: data.message } };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    updatePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
