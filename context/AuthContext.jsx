import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campusloop_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('campusloop_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync profile from server on load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
          localStorage.setItem('campusloop_user', JSON.stringify(profile));
        } catch (error) {
          console.error('Session validation error:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    setUser(data);
    setToken(data.token);
    localStorage.setItem('campusloop_token', data.token);
    localStorage.setItem('campusloop_user', JSON.stringify(data));
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    setUser(data);
    setToken(data.token);
    localStorage.setItem('campusloop_token', data.token);
    localStorage.setItem('campusloop_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campusloop_token');
    localStorage.removeItem('campusloop_user');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('campusloop_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const profile = await api.getProfile();
      setUser(profile);
      localStorage.setItem('campusloop_user', JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
