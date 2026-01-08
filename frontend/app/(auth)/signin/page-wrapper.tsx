import { checkAuth } from '../../../lib/auth-server';
import { redirect } from 'next/navigation';
import SignInPageContent from './page';

export default async function SignInWrapper() {
  const isAuthenticated = await checkAuth();
  
  if (isAuthenticated) {
    redirect('/dashboard');
  }

  return <SignInPageContent />;
}