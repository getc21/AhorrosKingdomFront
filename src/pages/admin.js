import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al dashboard
    router.push('/dashboard');
  }, [router]);

  return null;
}
