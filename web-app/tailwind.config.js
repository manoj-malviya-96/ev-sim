/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}",], theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#92ed99', // Primary base color (e.g., a blue shade)
                },
            },
        },
    }, plugins: [],
};