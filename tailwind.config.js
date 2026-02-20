/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'system-ui', 'sans-serif'],
    },
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-smooth': 'bounceSmooth 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(151, 227, 50, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(151, 227, 50, 0)' },
        },
        bounceSmooth: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      colors: {
        // Light mode colors
        light: {
          primary: '#97E332',
          secondary: '#6ABF4B',
          accent: '#008A8A',
          'bg-main': '#FFFFFF',
          'bg-card': '#F5F5F5',
          'text-primary': '#0F172A',
          'text-secondary': '#475569',
          'text-disabled': '#CBD5E1',
        },
        // Dark mode colors
        dark: {
          primary: '#97E332',
          secondary: '#6ABF4B',
          accent: '#008A8A',
          'bg-main': '#0F172A',
          'bg-card': '#1E293B',
          'text-primary': '#F1F5F9',
          'text-secondary': '#CBD5E1',
          'text-disabled': '#94A3B8',
        },
        // Exported for easy use
        primary: '#97E332',
        secondary: '#6ABF4B',
        accent: '#008A8A',
        'bg-main': '#0F172A',
        'bg-card': '#1E293B',
        'bg-card-dark': '#0F1729',
        'text-primary': '#F1F5F9',
        'text-secondary': '#CBD5E1',
        'text-disabled': '#94A3B8',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #97E332 0%, #008A8A 50%, #6ABF4B 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(151, 227, 50, 0.1) 0%, rgba(0, 138, 138, 0.1) 100%)',
        'gradient-btn': 'linear-gradient(135deg, #97E332 0%, #6ABF4B 100%)',
      },
    },
  },
  plugins: [],
};
