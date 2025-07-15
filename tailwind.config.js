/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}", // Added components path if required
  ],
  theme: {
    extend: {
      fontFamily: {
        hanken: ["Hanken Grotesk", "sans-serif"], // Updated font to Hanken Grotesk
      },
      colors: {
        primary: "#008ECC",    // Updated primary color
        secondary: "#F3F9FB",  // Updated secondary color
        background: "#FFFFFF", // White background
        text: "#666666",  
        b_text: "#333333",    // Dark Gray for text
        accent: "#008ECC",     // Accent color matching primary
        white: "#FFFFFF",      // white color
        sec_bg: "#F5F5F5",     // Second background color updated
        line_color: "#EDEDED", // Border color
      },
    },
  },
  plugins: [],
};
