/** @type {import('tailwindcss').Config} */

// Tailwind CSS Configuration
// This file defines the design system for our blog platform
// Think of it as the "style guide" that ensures visual consistency across the entire application

module.exports = {
    // Content paths - tells Tailwind which files to scan for class names
    // This is crucial for tree-shaking: only CSS for classes you actually use gets included
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
  
    // Dark mode configuration
    // 'media' respects the user's system preference
    // 'class' allows manual toggling with a CSS class
    darkMode: 'media', // or 'class' for manual dark mode toggle
  
    theme: {
      extend: {
        // Custom color palette that reflects our brand
        // These colors are carefully chosen for accessibility and visual appeal
        colors: {
          // Primary brand colors
          primary: {
            50: '#eff6ff',
            100: '#dbeafe', 
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6', // Main brand color
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
          
          // Secondary accent colors
          secondary: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
          },
  
          // Success colors (for positive actions)
          success: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
          },
  
          // Warning colors
          warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
  
          // Error colors
          error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
  
          // Neutral grays (extended for more options)
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          }
        },
  
        // Custom font families
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'], // Primary font for UI
          serif: ['Georgia', 'serif'], // For article content
          mono: ['Fira Code', 'monospace'], // For code blocks
        },
  
        // Extended spacing scale for precise layouts
        spacing: {
          '18': '4.5rem',   // 72px
          '88': '22rem',    // 352px
          '128': '32rem',   // 512px
          '144': '36rem',   // 576px
        },
  
        // Custom border radius values
        borderRadius: {
          'xl': '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
        },
  
        // Box shadow variations for depth
        boxShadow: {
          'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          
          // Custom shadows for specific use cases
          'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          'button': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
  
        // Animation and transition extensions
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.3s ease-out',
          'slide-down': 'slideDown 0.3s ease-out',
          'bounce-gentle': 'bounceGentle 2s infinite',
          'pulse-slow': 'pulse 3s infinite',
        },
  
        // Custom keyframes for animations
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          slideUp: {
            '0%': { transform: 'translateY(100%)' },
            '100%': { transform: 'translateY(0)' },
          },
          slideDown: {
            '0%': { transform: 'translateY(-100%)' },
            '100%': { transform: 'translateY(0)' },
          },
          bounceGentle: {
            '0%, 100%': { 
              transform: 'translateY(-5%)',
              animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
            },
            '50%': { 
              transform: 'translateY(0)',
              animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
            },
          },
        },
  
        // Extended screen sizes for responsive design
        screens: {
          'xs': '475px',    // Extra small devices
          '3xl': '1680px',  // Extra large screens
          '4xl': '2560px',  // Ultra-wide screens
        },
  
        // Typography scale extensions
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
          '7xl': ['4.5rem', { lineHeight: '1' }],
          '8xl': ['6rem', { lineHeight: '1' }],
          '9xl': ['8rem', { lineHeight: '1' }],
        },
  
        // Z-index scale for layering
        zIndex: {
          '60': '60',
          '70': '70',
          '80': '80',
          '90': '90',
          '100': '100',
        },
  
        // Custom aspect ratios
        aspectRatio: {
          '4/3': '4 / 3',
          '3/2': '3 / 2',
          '2/3': '2 / 3',
          '9/16': '9 / 16',
        },
  
        // Backdrop blur variations
        backdropBlur: {
          'xs': '2px',
        },
  
        // Custom gradients (used with bg-gradient-to-* utilities)
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='nonzero'%3E%3Cpath d='m56 8 4-4-4-4-4 4 4 4zm-8 8-4-4-4 4 4 4 4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        },
      },
    },
  
    // Plugins - simplified to avoid missing dependencies
    plugins: [
      // Custom plugin for additional utilities
      function({ addUtilities, addComponents, theme }) {
        // Custom utilities
        const newUtilities = {
          // Text shadow utilities
          '.text-shadow-sm': {
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          },
          '.text-shadow': {
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
          '.text-shadow-lg': {
            textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
          '.text-shadow-none': {
            textShadow: 'none',
          },
  
          // Scrollbar utilities
          '.scrollbar-hide': {
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          },
          '.scrollbar-thin': {
            'scrollbar-width': 'thin',
          },
  
          // Safe area utilities for mobile devices
          '.safe-top': {
            paddingTop: 'env(safe-area-inset-top)',
          },
          '.safe-bottom': {
            paddingBottom: 'env(safe-area-inset-bottom)',
          },
          '.safe-left': {
            paddingLeft: 'env(safe-area-inset-left)',
          },
          '.safe-right': {
            paddingRight: 'env(safe-area-inset-right)',
          },
        };
  
        // Custom components
        const newComponents = {
          // Button variants
          '.btn': {
            padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
            borderRadius: theme('borderRadius.md'),
            fontWeight: theme('fontWeight.medium'),
            fontSize: theme('fontSize.sm[0]'),
            lineHeight: theme('fontSize.sm[1].lineHeight'),
            transition: 'all 0.15s ease-in-out',
            cursor: 'pointer',
            border: '1px solid transparent',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:disabled': {
              opacity: '0.5',
              cursor: 'not-allowed',
            },
          },
  
          // Glass morphism effect
          '.glass': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          },
  
          // Card with hover effect
          '.card-interactive': {
            backgroundColor: theme('colors.white'),
            borderRadius: theme('borderRadius.lg'),
            padding: theme('spacing.6'),
            boxShadow: theme('boxShadow.card'),
            border: `1px solid ${theme('colors.gray.200')}`,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme('boxShadow.card-hover'),
            },
          },
        };
  
        addUtilities(newUtilities);
        addComponents(newComponents);
      },
    ],
  
    // Safelist classes that should never be purged
    // This is useful for classes that are generated dynamically
    safelist: [
      'bg-red-500',
      'bg-green-500',
      'bg-blue-500',
      'text-red-500',
      'text-green-500',
      'text-blue-500',
      // Add any dynamically generated classes here
    ],
  
    // Core plugins to disable if not needed (for smaller bundle size)
    corePlugins: {
      // Uncomment to disable features you don't use
      // container: false,
      // float: false,
    },
  };