import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <Navbar />
        <Component {...pageProps} />
      </ToastProvider>
    </ThemeProvider>
  );
}
