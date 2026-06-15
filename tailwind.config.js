/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-hover': 'var(--bg-hover)',
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        accent: 'var(--accent)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-dim': 'var(--text-dim)',
        success: 'var(--success)',
        'success-light': 'var(--success-light)',
        error: 'var(--error)',
        'error-light': 'var(--error-light)',
        line: 'var(--line)',
        'line-light': 'var(--line-light)',
        card: 'var(--card)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        'sm': 'var(--radius-sm)',
        'lg': 'var(--radius-lg)',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow)',
        'lg': 'var(--shadow-lg)',
        'sm': 'var(--shadow-sm)',
      },
      animation: {
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        spin: 'spin 1.5s linear infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
