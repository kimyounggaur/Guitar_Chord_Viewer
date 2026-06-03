/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'Nunito', 'Pretendard', 'sans-serif'],
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neumorphic:
          '6px 6px 14px rgba(0,0,0,.08), -6px -6px 14px rgba(255,255,255,.9)',
        'neumorphic-inset':
          'inset 4px 4px 10px rgba(0,0,0,.06), inset -4px -4px 10px rgba(255,255,255,.95)',
      },
    },
  },
  plugins: [],
};
