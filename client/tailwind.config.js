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
                'float': 'float 15s ease-in-out infinite',
                'drift-down': 'drift-down 30s linear infinite',
                'drift-right': 'drift-right 40s linear infinite',
                'typing': 'typing 3s steps(30, end) forwards',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(168, 85, 247, 0.2), 0 0 10px rgba(168, 85, 247, 0.2)' },
                    '100%': { boxShadow: '0 0 10px rgba(168, 85, 247, 0.4), 0 0 20px rgba(168, 85, 247, 0.3)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.1' },
                    '25%': { transform: 'translateY(-20px) translateX(10px)', opacity: '0.15' },
                    '50%': { transform: 'translateY(-10px) translateX(-5px)', opacity: '0.1' },
                    '75%': { transform: 'translateY(-25px) translateX(5px)', opacity: '0.12' },
                },
                'drift-down': {
                    '0%': { transform: 'translateY(-20px)', opacity: '1' },
                    '100%': { transform: 'translateY(110vh)', opacity: '1' },
                },
                'drift-right': {
                    '0%': { transform: 'translateX(0)', opacity: '0' },
                    '5%': { opacity: '1' },
                    '95%': { opacity: '1' },
                    '100%': { transform: 'translateX(calc(100vw + 200px))', opacity: '0' },
                },
                'typing': {
                    '0%': { width: '0', opacity: '0' },
                    '1%': { opacity: '1' },
                    '100%': { width: '100%', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
