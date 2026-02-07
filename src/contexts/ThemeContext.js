import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cargar preferencia guardada
    const saved = localStorage.getItem('theme-dark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (saved !== null) {
      setIsDark(JSON.parse(saved));
    } else {
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Guardar preferencia
    localStorage.setItem('theme-dark', JSON.stringify(isDark));
    
    // Aplicar a document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};
