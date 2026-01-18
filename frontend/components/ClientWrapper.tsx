'use client';

import { ReactNode } from 'react';
import { CookiesProvider } from 'react-cookie';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return <CookiesProvider>{children}</CookiesProvider>;
}