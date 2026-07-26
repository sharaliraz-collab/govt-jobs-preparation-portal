import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        govt: {
          emerald: '#0B5F3C',
          'emerald-dark': '#07452A',
          'emerald-light': '#E8F5EE',
          bg: '#F7F7F4',
          gold: '#C9A227',
          'gold-light': '#FBF5E0',
          charcoal: '#1E2422',
          muted: '#5B6561',
          border: '#E2E5E0',
          red: '#B3261E',
          open: '#1E7E44',
          closing: '#D97706'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', '"Noto Sans Arabic"', 'serif']
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(11, 95, 60, 0.08)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
        'elevated': '0 20px 40px -12px rgba(0,0,0,0.12)',
        'glow-emerald': '0 0 20px rgba(11, 95, 60, 0.15)',
        'glow-gold': '0 0 20px rgba(201, 162, 39, 0.2)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(11, 95, 60, 0.3)' },
          '50%': { boxShadow: '0 0 0 8px rgba(11, 95, 60, 0)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 6s ease infinite',
      },
    },
  },
  plugins: [],
};

export default config;
