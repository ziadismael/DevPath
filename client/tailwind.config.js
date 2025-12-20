/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Deep void backgrounds
                void: {
                    950: '#0a0a0f',
                    900: '#0f0f14',
                    800: '#14141a',
                },
                // Electric Purple (Primary)
                electric: {
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                },
                // Cyber Blue (Accent)
                cyber: {
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                },
                // Syntax highlighting colors
                syntax: {
                    green: '#4ade80',
                    blue: '#60a5fa',
                    pink: '#f472b6',
                    yellow: '#fbbf24',
                    purple: '#c084fc',
                },
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(168, 85, 247, 0.3)',
                'glow-md': '0 0 20px rgba(168, 85, 247, 0.4)',
                'glow-lg': '0 0 30px rgba(168, 85, 247, 0.5)',
                'glow-cyber-sm': '0 0 10px rgba(56, 189, 248, 0.3)',
                'glow-cyber-md': '0 0 20px rgba(56, 189, 248, 0.4)',
                'glow-cyber-lg': '0 0 30px rgba(56, 189, 248, 0.5)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(168, 85, 247, 0.2), 0 0 10px rgba(168, 85, 247, 0.2)' },
                    '100%': { boxShadow: '0 0 10px rgba(168, 85, 247, 0.4), 0 0 20px rgba(168, 85, 247, 0.3)' },
                },
            },
        },
    },
    plugins: [],
}
