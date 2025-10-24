import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null; // This is already here, just confirming it's part of the context
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
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

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8081';

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
        const normalized = parsed && typeof parsed === 'object'
          ? { ...parsed, role: typeof parsed.role === 'string' ? parsed.role.toLowerCase() : parsed.role }
          : parsed;
        setUser(normalized);
      } catch {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      if (!response.ok) {
        let message = 'Login failed';
        try {
          const errorData = await response.json();
          // Support ProblemDetail (Spring) and our custom error shape
          if (errorData.message) message = errorData.message;
          else if (errorData.error) message = errorData.error;
          else if (errorData.detail) message = errorData.detail;
          else if (errorData.errors && typeof errorData.errors === 'object') {
            const first = Object.values(errorData.errors)[0] as string | undefined;
            if (first) message = first;
          }
        } catch {
          const text = await response.text();
          if (text) message = text;
        }
        throw new Error(message);
      }

      const data = await response.json();
      const { token: jwtToken, user: userData } = data;

      const normalizedUser = userData && typeof userData === 'object'
        ? { ...userData, role: typeof userData.role === 'string' ? userData.role.toLowerCase() : userData.role }
        : userData;

      setToken(jwtToken);
      setUser(normalizedUser);
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      // Convert role to uppercase to match backend enum
      const payload = {
        ...userData,
        role: userData.role.toUpperCase()
      };

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Throw the structured error object from the backend
        if (errorData.errors) {
          throw errorData;
        }
        throw new Error(errorData.error || 'Registration failed');
      }

      // Registration was successful, no need to process response body here.
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
