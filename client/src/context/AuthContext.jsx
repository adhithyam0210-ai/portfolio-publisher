import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        removeAuthToken();
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load authenticated user:', err);
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (identifier, password) => {
    const res = await authApi.login({ identifier, password });
    if (res.success && res.token) {
      setAuthToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (usernameOrData, email, password, fullName, phone) => {
    let payload;
    if (typeof usernameOrData === 'object') {
      payload = usernameOrData;
    } else {
      payload = { username: usernameOrData, email, password, fullName, phone };
    }
    const res = await authApi.register(payload);
    if (res.success && res.token) {
      setAuthToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const loginWithGoogle = async (googlePayload) => {
    const res = await authApi.googleAuth(googlePayload);
    if (res.success && res.token) {
      setAuthToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Google sign-in failed');
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
