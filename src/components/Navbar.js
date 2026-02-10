'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const router = useRouter();
  const { isDark, toggleTheme, mounted } = useTheme();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <nav className="bg-bg-main border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-2xl font-bold truncate mr-2">
            <span className="gradient-text">Sistema de ahorros ENERGY</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-1 sm:gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 hover:bg-cyan-500/20 rounded-lg transition"
                title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
              >
                {isDark ? <Sun size={18} className="sm:w-5 sm:h-5 text-primary" /> : <Moon size={18} className="sm:w-5 sm:h-5 text-secondary" />}
              </button>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} className="sm:w-6 sm:h-6 text-primary" /> : <Menu size={20} className="sm:w-6 sm:h-6 text-primary" />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-sm lg:text-base hover:text-primary transition">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-sm lg:text-base hover:text-primary transition">
                  Perfil
                </Link>
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="p-1.5 sm:p-2 hover:bg-cyan-500/20 rounded-lg transition"
                    title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
                  >
                    {isDark ? <Sun size={18} className="text-primary" /> : <Moon size={18} className="text-secondary" />}
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm lg:text-base hover:text-primary transition"
                >
                  <LogOut size={16} className="lg:w-4.5 lg:h-4.5" />
                  <span className="hidden lg:inline">Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-primary transition">
                  Iniciar Sesión
                </Link>
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-cyan-500/20 rounded-lg transition"
                  >
                    {isDark ? <Sun size={20} className="text-primary" /> : <Moon size={20} className="text-secondary" />}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block hover:text-primary py-2 transition">
                  Dashboard
                </Link>
                <Link href="/profile" className="block hover:text-primary py-2 transition">
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left hover:text-primary py-2 transition"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block hover:text-primary py-2 transition">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
