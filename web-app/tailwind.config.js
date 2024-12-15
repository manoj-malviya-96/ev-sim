/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}",], theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#589361', // Primary base color (e.g., a blue shade)
                },
            },
        },
    }, plugins: [],
};