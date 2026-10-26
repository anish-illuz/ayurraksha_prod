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
          DEFAULT: '#80A03C', // Signature Ayurraksha Olive Green
          dark: '#58702E',
          light: '#95B847',
          hover: '#6F8C31',
          subtle: '#F4F7EE',
        },
        forest: {
          DEFAULT: '#58702E', // Live site deep herbal green
          dark: '#014C1A',   // Live logo green
          light: '#6B8938',
        },
        botanical: {
          DEFAULT: '#80A03C', // Live site signature olive green
          dark: '#58702E',
          light: '#95B847',
        },
        ivory: {
          DEFAULT: '#FAFAFA', // Live site clean background
          dark: '#F3F4F1',
          card: '#FFFFFF',
        },
        sage: {
          DEFAULT: '#EAF0DF', // Live site soft olive sage
          light: '#F4F7EE',
          dark: '#D8E4C4',
        },
        terracotta: {
          DEFAULT: '#B45309',
          dark: '#9A3412',
          light: '#D97706',
        },
        charcoal: {
          DEFAULT: '#2E332E', // Live site text color
          light: '#4A524A',
          muted: '#6B726B',
        },
        border: {
          botanical: 'rgba(128, 160, 60, 0.25)',
          subtle: 'rgba(46, 51, 46, 0.08)',
        }
      },
      fontFamily: {
        heading: ['Jost', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        jost: ['Jost', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Jost', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
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
