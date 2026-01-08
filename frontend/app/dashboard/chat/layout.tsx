import { requireAuth } from '../../../lib/auth-server';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(); // This will redirect to signin if not authenticated

  return <>{children}</>;
}