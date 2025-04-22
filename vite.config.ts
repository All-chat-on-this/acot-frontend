import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3000,
      proxy: env.VITE_ENV === 'development' ? {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        }
      } : undefined
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_ENV)
    }
  }
})
