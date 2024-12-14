/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}",], theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4e73dc', // Primary base color (e.g., a blue shade)
                    light: '#5a74ae',   // Optional lighter version
                    dark: '#4e73dc',    // Optional darker version
                },
            },
        },
    }, plugins: [],
};