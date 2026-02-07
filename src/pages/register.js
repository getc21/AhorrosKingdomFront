import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <p className="text-text-secondary italic">Redirigiendo...</p>
    </div>
  );
}
