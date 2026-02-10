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
        primary: '#00D4FF',
        secondary: '#00B4D8',
        accent: '#9D4EDD',
        'bg-main': '#0F172A',
        'bg-card': '#1E293B',
        'bg-card-dark': '#0F1729',
        'text-primary': '#F1F5F9',
        'text-secondary': '#CBD5E1',
        'text-disabled': '#94A3B8',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #00D4FF 0%, #00B4D8 50%, #9D4EDD 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(157, 78, 221, 0.1) 100%)',
        'gradient-btn': 'linear-gradient(135deg, #00D4FF 0%, #00B4D8 100%)',
      },
    },
  },
  plugins: [],
};
