'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

export default function Home() {
  const [cookies] = useCookies(['token']);
  const [redirectHandled, setRedirectHandled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    const token = cookies.token;
    if (token) {
      router.push('/dashboard');
    }
    setRedirectHandled(true); // Mark that redirect check is done
  }, [cookies, router]);

  // Don't render content until redirect is handled to avoid flickering
  if (!redirectHandled) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">Checking authentication...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            Welcome to Todo App
          </h1>
          <p className="text-gray-600 mb-8">
            Manage your tasks efficiently and boost your productivity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signin" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}