import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';
import { storage } from '../utils/storage';
import { API_BASE } from '../utils/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
  idNumber: string;
}

interface DecodedToken {
  exp: number;
  iat: number;
  email?: string;
  role?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      console.log('AuthProvider: start loading');
      try {
        const storedToken = await storage.getItem('token');
        const storedUser = await storage.getItem('user');
        console.log('AuthProvider: storedToken =', storedToken ? 'exists' : 'null');
        console.log('AuthProvider: storedUser =', storedUser ? 'exists' : 'null');

        if (storedToken && storedUser) {
          try {
            const decoded = jwtDecode<DecodedToken>(storedToken);
            console.log('AuthProvider: decoded token', decoded);
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
            console.log('AuthProvider: user restored', parsedUser.email);
          } catch (error) {
            console.error('AuthProvider: invalid token', error);
            await storage.removeItem('token');
            await storage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('AuthProvider: failed to load from storage', error);
      } finally {
        setIsLoading(false);
        console.log('AuthProvider: isLoading set to false');
      }
    };

    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthProvider: login attempt', email);
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(data?.message || 'Login failed');

    await storage.setItem('token', data.token);
    await storage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    console.log('AuthProvider: login successful');
  };

  const register = async (formData: RegisterData) => {
    console.log('AuthProvider: register attempt', formData.email);
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const text = await response.text();
    const responseData = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(responseData?.message || 'Registration failed');
    console.log('AuthProvider: registration successful');
  };

  const logout = async () => {
    console.log('AuthProvider: logout');
    await storage.removeItem('token');
    await storage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (nextUser: User) => {
    console.log('AuthProvider: update user');
    setUser(nextUser);
    await storage.setItem('user', JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
