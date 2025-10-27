import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Color Palette from Design System
      colors: {
        // Primary Colors
        primary: {
          purple: '#7B68EE',
          dark: '#2B3540',
          white: '#FFFFFF',
        },
        // Secondary Colors
        secondary: {
          blue: '#4A9FFF',
          indigo: '#6366F1',
          pink: '#FF6B9D',
        },
        // Accent Colors
        accent: {
          yellow: '#FFD93D',
          teal: '#4FD1C5',
          orange: '#FF8A65',
          green: '#4CAF50',
        },
        // Functional/Status Colors
        status: {
          blue: '#54B4D3',
          purple: '#9F7AEA',
          yellow: '#FDB022',
          red: '#EF5350',
          teal: '#26C6DA',
        },
        success: {
          DEFAULT: '#43A047',
          green: '#43A047',
        },
        error: {
          DEFAULT: '#E53935',
          red: '#E53935',
        },
        // Neutral/Gray Scale
        gray: {
          50: '#FAFBFC',
          100: '#F7FAFC',
          200: '#E2E8F0',
          300: '#CBD5E0',
          500: '#718096',
          700: '#4A5568',
          900: '#1A202C',
        },
        // Background Colors
        background: {
          DEFAULT: '#FFFFFF',
          primary: '#FFFFFF',
          secondary: '#F7F8FA',
          tertiary: '#F1F3F5',
          hover: '#F4F5F7',
        },
        // Legacy support
        foreground: '#1A202C',
        border: '#CBD5E0',
      },
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['SF Mono', 'Roboto Mono', 'monospace'],
      },
      fontSize: {
        // Headings
        'h1': ['32px', { lineHeight: '40px', letterSpacing: '-0.5px', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '32px', letterSpacing: '-0.3px', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '28px', letterSpacing: '-0.2px', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '24px', letterSpacing: '-0.1px', fontWeight: '500' }],
        // Body Text
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', letterSpacing: '0.1px', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '16px', letterSpacing: '0.2px', fontWeight: '400' }],
        // Special Text
        'button': ['14px', { lineHeight: '20px', letterSpacing: '0.2px', fontWeight: '500' }],
        'link': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '500' }],
        'label': ['12px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '500' }],
        'badge': ['11px', { lineHeight: '16px', letterSpacing: '0.3px', fontWeight: '600' }],
      },
      // Spacing System (dp values)
      spacing: {
        '0.5': '2px',   // 2dp
        '1': '4px',     // 4dp
        '2': '8px',     // 8dp
        '3': '12px',    // 12dp
        '4': '16px',    // 16dp
        '5': '20px',    // 20dp
        '6': '24px',    // 24dp
        '8': '32px',    // 32dp
        '10': '40px',   // 40dp
        '12': '48px',   // 48dp
      },
      // Border Radius
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
      },
      // Box Shadow
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'kanban': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'focus': '0 0 0 3px rgba(123, 104, 238, 0.12)',
      },
      // Animation/Transition Durations
      transitionDuration: {
        'micro': '100ms',
        'standard': '200ms',
        'emphasis': '300ms',
        'complex': '400ms',
      },
      // Animation Timing Functions
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      // Animation Keyframes
      keyframes: {
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'slide-in-from-top': {
          'from': { transform: 'translateY(-8px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-bottom': {
          'from': { transform: 'translateY(8px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'zoom-in': {
          'from': { transform: 'scale(0.95)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'fade-slide-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-in-out',
        'slide-in-from-top': 'slide-in-from-top 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        'slide-in-from-bottom': 'slide-in-from-bottom 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        'zoom-in': 'zoom-in 200ms ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-slide-up': 'fade-slide-up 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
