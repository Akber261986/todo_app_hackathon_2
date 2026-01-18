'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import apiClient from '@/lib/api';
import Image from 'next/image';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [cookies, setCookie] = useCookies(['token']);
  const router = useRouter();

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    const token = cookies.token;
    if (token) {
      router.push('/dashboard');
    }
  }, [cookies, router]);

  const togglePasswordVisibility = () => {
    setTogglePassword(!togglePassword);
  };

  const passwordInputType = togglePassword ? 'text' : 'password';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/v1/auth/signin', {
        email,
        password,
      });

      const { access_token } = response.data;

      // Set cookie with 24-hour expiration - allow cross-origin for deployed version
      setCookie('token', access_token, {
        path: '/',
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
      });

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6 bg-gradient-to-b from-blue-300 to-blue-700">
      <div className="w-full max-w-md bg-gradient-to-b from-blue-700 to-blue-950 rounded-3xl">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-8">
          {/* Checkmark Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back to DO IT</h1>
            <p className="text-blue-200">Have another productive day !</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-center" role="alert">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400/50 shadow-md"
                placeholder="E-mail"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={passwordInputType}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-14 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400/50 shadow-md"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-800"
              >
                {togglePassword ? (
                  <Image src="/svg/eye-solid.svg" alt="Hide" width={24} height={24} />
                ) : (
                  <Image src="/svg/eye-slash-solid.svg" alt="Show" width={24} height={24} />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-blue-300 text-sm hover:underline">
                forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'sign in'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-blue-200">
              Don't have an account?{' '}
              <Link href="/signup" className="text-cyan-300 font-medium hover:underline">
                sign up
              </Link>
            </p>
          </div>

          {/* Social Login (Optional - Icons only, no functionality) */}
          <div className="mt-10">
            <p className="text-center text-blue-200 mb-4">Sign Up with:</p>
            <div className="flex justify-center">
              <button className="bg-white/90 rounded-xl shadow-md hover:shadow-lg transition">
                <Image src="/images/google_logo.png" alt="Google" width={250} height={250} />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-blue-300 text-sm">
            <p>TodoApp - 2026 © All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}