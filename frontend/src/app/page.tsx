// Server Component - page.tsx can be a Server Component now
import AuthWrapper from '@/components/AuthWrapper';

export default function Home() {
  // This is now a Server Component that delegates to AuthWrapper client component
  // In the future, we can fetch initial data here and pass it down
  return <AuthWrapper />;
}
