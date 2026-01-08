import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/signin');
  }

  return token;
}

export async function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  return !!token;
}