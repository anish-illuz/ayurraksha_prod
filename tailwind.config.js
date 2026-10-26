/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#16382C',
          dark: '#0E251D',
          light: '#224D3E',
        },
        botanical: {
          DEFAULT: '#2D5A43',
          dark: '#214432',
          light: '#3D7457',
        },
        ivory: {
          DEFAULT: '#FAF7F2',
          dark: '#F3EDE2',
          card: '#FFFFFF',
        },
        sage: {
          DEFAULT: '#E8EFE6',
          light: '#F3F7F2',
          dark: '#D5DFD2',
        },
        terracotta: {
          DEFAULT: '#B45309',
          dark: '#9A3412',
          light: '#D97706',
        },
        charcoal: {
          DEFAULT: '#1F2421',
          light: '#3C443F',
          muted: '#626C65',
        },
        border: {
          botanical: 'rgba(22, 56, 44, 0.12)',
          subtle: 'rgba(22, 56, 44, 0.06)',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'DM Serif Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(22, 56, 44, 0.04)',
        'card-hover': '0 8px 30px rgba(22, 56, 44, 0.08)',
        'drawer': '-4px 0 24px rgba(22, 56, 44, 0.15)',
        'dropdown': '0 10px 30px -5px rgba(22, 56, 44, 0.12)',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'badge': '6px',
      }
    },
  },
  plugins: [],
};
