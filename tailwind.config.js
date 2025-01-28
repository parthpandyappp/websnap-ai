/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Ensure Tailwind scans the root HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Include all relevant files in the src directory
  ],
  theme: {
    extend: {}, // Customize your theme here
  },
  plugins: [], // Add Tailwind plugins here if needed
};
