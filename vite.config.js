import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                tos: resolve(__dirname, 'tos.html'),
                privacy: resolve(__dirname, 'privacy.html')
            }
        }
    }
})
