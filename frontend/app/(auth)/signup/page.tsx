import { checkAuth } from '../../../lib/auth-server';
import { redirect } from 'next/navigation';
import SignUpPageContent from './page-content';

export default async function Page() {
  const isAuthenticated = await checkAuth();
  
  if (isAuthenticated) {
    redirect('/dashboard');
  }

  return <SignUpPageContent />;
}