import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        cors: {
            origin: true,
            credentials: true,
        },
        proxy: {
            "/api": {
                target: process.env.API_PROXY_TARGET || "http://localhost:8080",
                changeOrigin: true,
                secure: false,
                headers: {
                    Origin: process.env.API_PROXY_TARGET || "http://localhost:8080",
                },
            },
        },
    },
})
