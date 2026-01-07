'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { useAuth } from '@/lib/auth';
import ChatInterface from './ChatInterface';
import '../../chat.css'; // Import chat styles

export default function Chat() {
  const router = useRouter();
  const [cookies] = useCookies(['token']);
  const { user, loading } = useAuth();
  const [userId, setUserId] = useState<string>('');

  // Check if user is authenticated
  useEffect(() => {
    const token = cookies.token;
    if (!loading && !token) {
      router.push('/signin');
    }
  }, [cookies.token, loading, router]);

  // Initialize userId after component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || 'user_' + Date.now();
    setUserId(storedUserId);

    // Initialize userId in localStorage if not present
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', storedUserId);
    }
  }, []);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-lg text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!cookies.token) {
    return null; // Router will handle the redirect
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <h1>Todo AI Chatbot</h1>
        <p className="user-id">User: {userId}</p>
      </header>

      <main className="chat-main">
        {userId ? <ChatInterface userId={userId} /> : (
          <div className="chat-container">
            <div className="chat-messages">
              <div className="welcome-message">
                <p>Loading chat...</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="chat-footer">
        <p>AI-Powered Todo Management Assistant</p>
      </footer>
    </div>
  );
}