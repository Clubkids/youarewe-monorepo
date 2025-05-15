/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // No src/app reference since we're using Pages Router
  ],
  theme: {
    extend: {
      colors: {
        'youarewe-purple': '#833ccf',
        'youarewe-grey': '#B4A7A5',
      },
      fontFamily: {
        'elijah': ['CSElijah', 'serif'],
        'eskepade': ['EskapadeFraktur-Black', 'sans-serif'],
        'sax-mono': ['Sax Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}