import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authApi } from '../auth/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    void checkCurrentSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkCurrentSession = async () => {
    axios.defaults.withCredentials = true;
    const token = localStorage.getItem('truthlens_access_token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await authApi.profile();
      if (res?.data?.user) {
        setUser(res.data.user);
        return;
      }
      await refreshSession();
    } catch (err) {
      await refreshSession();
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const res = await authApi.refresh();
      if (res?.data?.access_token) {
        localStorage.setItem('truthlens_access_token', res.data.access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
        const profileRes = await authApi.profile();
        if (profileRes?.data?.user) {
          setUser(profileRes.data.user);
          return true;
        }
      }
    } catch (err) {
      await clearSession();
      return false;
    }

    await clearSession();
    return false;
  };

  const loginSuccess = (authData) => {
    if (authData.access_token) {
      localStorage.setItem('truthlens_access_token', authData.access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authData.access_token}`;
    }
    setUser(authData.user);
  };

  const clearSession = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Fail gracefully if logout is unavailable.
    }
    localStorage.removeItem('truthlens_access_token');
    localStorage.removeItem('truthlens_refresh_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setLoading(false);
  };

  const logout = async () => {
    await clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginSuccess, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
