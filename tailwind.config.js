/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          primary: '#97E332',
          secondary: '#6ABF4B',
          accent: '#008A8A',
          'bg-main': '#F8FAFC',
          'bg-card': '#FFFFFF',
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
