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
        primary: {
          DEFAULT: '#204A3B', // Deep botanical green
          dark: '#17362B',
          light: '#2D614E',
          hover: '#1B4033',
          subtle: '#FAF9F5',
        },
        forest: {
          DEFAULT: '#204A3B', // Deep botanical green
          dark: '#17362B',
          light: '#2D614E',
        },
        botanical: {
          DEFAULT: '#204A3B', // Deep botanical green
          dark: '#17362B',
          light: '#2D614E',
        },
        ivory: {
          DEFAULT: '#FAF9F5', // Warm ivory
          dark: '#F3F0E6',
          card: '#FFFFFF',
        },
        sage: {
          DEFAULT: '#E8EFE7', // Soft sage
          light: '#F4F7F2',
          dark: '#D8E4D7',
        },
        gold: {
          DEFAULT: '#B49A70', // Muted antique gold
          dark: '#9A8057',
          light: '#C7B18B',
        },
        terracotta: {
          DEFAULT: '#B45309',
          dark: '#9A3412',
          light: '#D97706',
        },
        charcoal: {
          DEFAULT: '#26352D', // Dark charcoal green
          light: '#3C4D43',
          muted: '#66736A', // Muted grey green
        },
        border: {
          botanical: 'rgba(32, 74, 59, 0.15)',
          subtle: 'rgba(38, 53, 45, 0.08)',
        }
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
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
