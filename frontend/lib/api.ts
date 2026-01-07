'use client';

import axios from 'axios';

// Helper function to check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Create an axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
});

// Add a request interceptor to include the JWT token in headers
apiClient.interceptors.request.use(
  (config) => {
<<<<<<< HEAD
    // Only access cookies in browser environment
    if (isBrowser) {
      // Get the token from cookies by reading document.cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

=======
    // Only access localStorage in browser environment
    if (isBrowser) {
      const token = localStorage.getItem('token');
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration or invalidation
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token is invalid/expired, redirect to login (only in browser)
    if (error.response?.status === 401 && isBrowser) {
<<<<<<< HEAD
      // Remove the token cookie by setting its expiration to the past
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
=======
      localStorage.removeItem('token');
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;