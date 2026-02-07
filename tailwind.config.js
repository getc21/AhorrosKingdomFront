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
        primary: '#1E3A8A',
        secondary: '#16A34A',
        accent: '#F59E0B',
        'bg-main': '#F9FAFB',
        'bg-card': '#FFFFFF',
        'text-primary': '#374151',
        'text-secondary': '#6B7280',
        'text-disabled': '#9CA3AF',
      },
    },
  },
  plugins: [],
};
