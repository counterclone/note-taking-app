// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",   // App directory
    "./src/pages/**/*.{js,ts,jsx,tsx}", // Just in case you're using some pages
    "./src/components/**/*.{js,ts,jsx,tsx}", // Common for shared UI components
    
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
