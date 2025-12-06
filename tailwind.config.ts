import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: "class",
    content: ["src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            // Extendemos pero confiamos en los colores default de Tailwind (slate, blue, etc)
            // Definimos solo lo semántico extra si es necesario
            colors: {
                // Si se necesita un acento específico
                accent: {
                    DEFAULT: '#2563eb', // blue-600
                    hover: '#1d4ed8',   // blue-700
                }
            },
            animation: {
                'card-pop-in': 'card-pop-in 0.2s ease-out forwards',
            },
            keyframes: {
                'card-pop-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
