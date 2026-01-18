'use client';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useCookies } from 'react-cookie';
import apiClient from './api';

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedToken = cookies.token;
    if (storedToken) {
      setToken(storedToken);
      // In a real implementation, you would decode the token or make an API call to get user info
      // For now, we'll just set a basic user object
      try {
        // Decode JWT token to get user info
        const base64Url = storedToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decodedToken = JSON.parse(jsonPayload);
        setUser({ id: decodedToken.sub, email: decodedToken.email || 'user' });
      } catch (error) {
        console.error('Error decoding token:', error);
        removeCookie('token', { path: '/' });
      }
    }
    setLoading(false);
  }, [cookies.token, removeCookie]);

  const login = async (email: string, password: string) => {
    // This would typically call your backend auth API
    // For now, we'll simulate the process
    const response = await apiClient.post('/api/v1/auth/signin', {
      email,
      password,
    });

    const { access_token } = response.data;

    // Set cookie with 24-hour expiration - allow cross-origin for deployed version
    setCookie('token', access_token, {
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      sameSite: 'none', // Always use 'none' to allow cross-site usage
      secure: process.env.NODE_ENV === 'production', // Secure only in production
      httpOnly: false, // Keep false for client-side access (required for JWT)
    });
    setToken(access_token);

    // Decode token to get user info
    try {
      const base64Url = access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decodedToken = JSON.parse(jsonPayload);
      setUser({ id: decodedToken.sub, email: decodedToken.email || email });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const signup = async (email: string, password: string) => {
    // This would typically call your backend auth API
    const response = await apiClient.post('/api/v1/auth/signup', {
      email,
      password,
    });

    const { access_token } = response.data;

    // Set cookie with 24-hour expiration - allow cross-origin for deployed version
    setCookie('token', access_token, {
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      sameSite: 'none', // Always use 'none' to allow cross-site usage
      secure: process.env.NODE_ENV === 'production', // Secure only in production
      httpOnly: false, // Keep false for client-side access (required for JWT)
    });
    setToken(access_token);

    // Decode token to get user info
    try {
      const base64Url = access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decodedToken = JSON.parse(jsonPayload);
      setUser({ id: decodedToken.sub, email: decodedToken.email || email });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const logout = () => {
    removeCookie('token', { path: '/' });
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}