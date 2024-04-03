/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html","./src/**/*.tsx",
    './pages/**/*.tsx',
    './components/**/*.tsx',
  ],
  theme: {
    extend: {},
    container:{
      padding:{
        md:"10rem",
      }
    }
  },
  plugins: [],
}

