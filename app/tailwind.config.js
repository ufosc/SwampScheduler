/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            gridTemplateRows: {
                '11': 'repeat(11, minmax(0, 1fr))'
            }
        },
    },
    plugins: [],
}
