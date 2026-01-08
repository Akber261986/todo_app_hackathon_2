'use server';

import { checkAuth } from '../../lib/auth-server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const isAuthenticated = await checkAuth();
  
  if (isAuthenticated) {
    redirect('/dashboard');
  } else {
    redirect('/signin');
  }
}