'use client';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
<<<<<<< HEAD
import { useCookies } from 'react-cookie';
=======
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
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
<<<<<<< HEAD
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
=======
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
<<<<<<< HEAD
    const storedToken = cookies.token;
=======
    const storedToken = localStorage.getItem('token');
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
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
<<<<<<< HEAD
        removeCookie('token', { path: '/' });
      }
    }
    setLoading(false);
  }, [cookies.token, removeCookie]);
=======
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c

  const login = async (email: string, password: string) => {
    // This would typically call your backend auth API
    // For now, we'll simulate the process
<<<<<<< HEAD
    const response = await apiClient.post('/api/v1/auth/signin', {
=======
    const response = await apiClient.post('/auth/signin', {
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
      email,
      password,
    });

    const { access_token } = response.data;

<<<<<<< HEAD
    // Set cookie with 24-hour expiration
    setCookie('token', access_token, {
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      sameSite: true,
      secure: process.env.NODE_ENV === 'production'
    });
=======
    localStorage.setItem('token', access_token);
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
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
<<<<<<< HEAD
    const response = await apiClient.post('/api/v1/auth/signup', {
=======
    const response = await apiClient.post('/auth/signup', {
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
      email,
      password,
    });

    const { access_token } = response.data;

<<<<<<< HEAD
    // Set cookie with 24-hour expiration
    setCookie('token', access_token, {
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      sameSite: true,
      secure: process.env.NODE_ENV === 'production'
    });
=======
    localStorage.setItem('token', access_token);
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
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
<<<<<<< HEAD
    removeCookie('token', { path: '/' });
=======
    localStorage.removeItem('token');
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
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