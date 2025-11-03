import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../api/apiClient';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null; // This is already here, just confirming it's part of the context
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsed = JSON.parse(storedUser);
        const normalized = parsed && typeof parsed === 'object' // Ensure role is UPPERCASE
          ? { ...parsed, role: typeof parsed.role === 'string' ? parsed.role.toUpperCase() : parsed.role }
          : parsed;
        
        console.log('🔍 Loading user from localStorage:', normalized);
        console.log('🔍 Stored role:', normalized.role);
        
        setUser(normalized);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email: email.trim(),
        password: password.trim(),
      });

      const data = response.data;
      const { token: jwtToken, user: userData } = data;

      const normalizedUser = userData && typeof userData === 'object' // Ensure role is UPPERCASE
        ? { ...userData, role: typeof userData.role === 'string' ? userData.role.toUpperCase() : userData.role }
        : userData;

      // Debug logging
      console.log('🔍 Backend user data:', userData);
      console.log('🔍 Normalized user data:', normalizedUser);
      console.log('🔍 User role after normalization:', normalizedUser.role);
      console.log('🔍 Role type:', typeof normalizedUser.role);
      console.log('🔍 Role comparison tests:');
      console.log('  - ADMIN:', normalizedUser.role === 'ADMIN');
      console.log('  - EMPLOYER:', normalizedUser.role === 'EMPLOYER');
      console.log('  - CANDIDATE:', normalizedUser.role === 'CANDIDATE');

      setToken(jwtToken);
      setUser(normalizedUser);
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (error) {
      // Axios error handling is more direct
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        let message = 'Login failed';
        if (errorData.message) message = errorData.message;
        else if (errorData.error) message = errorData.error;
        else if (errorData.detail) message = errorData.detail;
        throw new Error(message);
      }
      throw error;
    }
  };

  const register = async (userData: any): Promise<User> => {
    try {
      // Convert role to uppercase to match backend enum
      const payload = {
        ...userData,
        role: userData.role.toUpperCase()
      };

      console.log('🔍 Registration payload:', payload);
      console.log('🔍 Role being sent:', payload.role);

      const response = await apiClient.post('/api/auth/register', payload);
      
      console.log('🔍 Registration response:', response.data);
      console.log('🔍 Registered user role:', response.data.role);
      
      return response.data;
    } catch (error) {
      // Axios error handling
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        // If there are specific validation errors, re-throw them for the form to handle.
        // The new response interceptor will handle generic messages.
        throw error.response.data;
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const response = await apiClient.get('/api/auth/me');
      const userData = response.data;
      
      const normalizedUser = userData && typeof userData === 'object'
        ? { ...userData, role: typeof userData.role === 'string' ? userData.role.toUpperCase() : userData.role }
        : userData;
      
      setUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
