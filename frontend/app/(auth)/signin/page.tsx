'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import apiClient from '@/lib/api';
import Image from 'next/image';
=======
import Link from 'next/link';
import apiClient from '@/lib/api';
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [togglePassword, setTogglePassword] = useState(false);
  const [, setCookie] = useCookies(['token']);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setTogglePassword(!togglePassword);
  };

  const passwordInputType = togglePassword ? 'text' : 'password';

=======
  const router = useRouter();

>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
<<<<<<< HEAD
      const response = await apiClient.post('/api/v1/auth/signin', {
=======
      const response = await apiClient.post('/auth/signin', {
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
        email,
        password,
      });

<<<<<<< HEAD
      const { access_token } = response.data;

      // Set cookie with 24-hour expiration
      setCookie('token', access_token, {
        path: '/',
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        sameSite: true,
        secure: process.env.NODE_ENV === 'production'
      });

=======
      // Store the token
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);

      // Redirect to dashboard
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-between">
        <div>
          <div className="text-white text-2xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            TodoApp
          </div>
        </div>
        
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome back to TodoApp</h1>
          <p className="text-indigo-100 text-lg">Sign in to manage your tasks and boost productivity.</p>
        </div>
        
        <div className="text-white text-sm opacity-75">
          <p>© 2026 TodoApp. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-gray-600">Enter your credentials to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
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
=======
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
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
=======
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
        </div>
      </div>
    </div>
  );
}