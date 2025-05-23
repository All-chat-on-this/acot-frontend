import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path'
import {createHtmlPlugin} from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    // Load env file based on `mode` in the current directory
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [
            react(),
            createHtmlPlugin({
                inject: {
                    data: {
                        title: 'All-chat-on-this',
                    },
                },
            }),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src')
            }
        },
        server: {
            port: 48081,
            proxy: env.VITE_ENV === 'development' ? {
                '/api': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                }
            } : undefined
        },
        define: {
            __APP_ENV__: JSON.stringify(env.VITE_ENV)
        },
        build: {
            sourcemap: true
        }
    }
})
