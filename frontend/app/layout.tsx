import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/auth';
<<<<<<< HEAD
import FloatingChatbot from '../components/FloatingChatbot';
import ClientWrapper from '../components/ClientWrapper';
=======
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Multi-user Todo application with authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
<<<<<<< HEAD
        <ClientWrapper>
          <AuthProvider>
            {children}
            <FloatingChatbot />
          </AuthProvider>
        </ClientWrapper>
=======
        <AuthProvider>
          {children}
        </AuthProvider>
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
      </body>
    </html>
  );
}