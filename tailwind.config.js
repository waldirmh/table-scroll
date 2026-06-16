/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
      },
      colors: {
        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-hover': 'var(--bg-hover)',
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        'primary-glow': 'var(--primary-glow)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-dim': 'var(--text-dim)',
        success: 'var(--success)',
        'success-bg': 'var(--success-bg)',
        'success-border': 'var(--success-border)',
        error: 'var(--error)',
        'error-bg': 'var(--error-bg)',
        'error-border': 'var(--error-border)',
        card: 'var(--card)',
        line: 'var(--line)',
        'line-light': 'var(--line-light)',
        'table-bg': 'var(--table-bg)',
        'table-header': 'var(--table-header-bg)',
        'table-stripe': 'var(--table-stripe)',
        'input-bg': 'var(--input-bg)',
        'input-focus-glow': 'var(--input-focus-glow)',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow)',
        'lg': 'var(--shadow-lg)',
        'sm': 'var(--shadow-sm)',
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'DEFAULT': 'var(--transition)',
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
