import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
        host: '127.0.0.1',
        port: 3000,
        proxy: {
            '/api': {
                // target: 'http://127.0.0.1:5000/',
                target: 'https://chenify.pythonanywhere.com/',
                changeOrigin: true,
            },
        },
    },
    clearScreen: false,
});
