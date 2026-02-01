/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0ea5e9', // Sky blue
                secondary: '#14b8a6', // Teal
                whatsapp: '#25D366',
            },
        },
    },
    plugins: [],
}
