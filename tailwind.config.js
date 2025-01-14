/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", 
    ],
    theme: {
        extend: {
          fontFamily: {
            'heading': ['Lexend', 'sans-serif'],
            'body': ['Plus Jakarta Sans', 'sans-serif'],
            'display': ['Inter', 'sans-serif'],
          },
          // keyframes: {
          //   blob: {
          //     '0%': {
          //       transform: 'translate(0px, 0px) scale(1)'
          //     },
          //     '33%': {
          //       transform: 'translate(30px, -50px) scale(1.1)'
          //     },
          //     '66%': {
          //       transform: 'translate(-20px, 20px) scale(0.9)'
          //     },
          //     '100%': {
          //       transform: 'translate(0px, 0px) scale(1)'
          //     }
          //   }
          // },
          // animation: {
          //   blob: 'blob 7s infinite',
          // },
        }
    },
    plugins: [
        require("tailwindcss-animate"),
        require("daisyui")
    ],
	daisyui: {
		themes: ["light", "dark", "cupcake"],
	  },
}
