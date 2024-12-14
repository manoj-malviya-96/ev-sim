/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}",], theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4edc6f', // Primary base color (e.g., a blue shade)
                    light: '#4b9c5e',   // Optional lighter version
                    dark: '#56ed78',    // Optional darker version
                },
            },
        },
    }, plugins: [],
};