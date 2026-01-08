'use client';

import axios from 'axios';

// Helper function to check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Create an axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  withCredentials: false,  // Keep false since we use Authorization headers
});

// Add a request interceptor to include the JWT token in headers
apiClient.interceptors.request.use(
  (config) => {
    // Only access cookies in browser environment
    if (isBrowser) {
      // Get the token from cookies by reading document.cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Don't override withCredentials since we're using headers instead of cookies for requests
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
      // Remove the token cookie by setting its expiration to the past
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;