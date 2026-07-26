'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { IUser } from '@/lib/types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  register: (name: string, email: string, password: string) => Promise<IUser>;
  logout: () => void;
  isAdmin: boolean;
  toggleSaveJobInState: (jobId: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('govt_portal_token');
    if (savedToken) {
      setToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('govt_portal_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('govt_portal_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('govt_portal_token');
    setToken(null);
    setUser(null);
  };

  const toggleSaveJobInState = (jobId: string) => {
    if (!user) return;
    const currentSaved = user.savedJobs || [];
    const isSaved = currentSaved.some(id => (typeof id === 'string' ? id === jobId : (id as any)._id === jobId));

    let updatedSaved;
    if (isSaved) {
      updatedSaved = currentSaved.filter(id => (typeof id === 'string' ? id !== jobId : (id as any)._id !== jobId));
    } else {
      updatedSaved = [...currentSaved, jobId];
    }

    setUser({ ...user, savedJobs: updatedSaved as any });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        toggleSaveJobInState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
