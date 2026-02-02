/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'comp-dark': '#0f172a',
                'comp-blue': '#3b82f6',
                'comp-card': '#1e293b',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
