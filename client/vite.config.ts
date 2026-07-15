import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), vueJsx(), tailwindcss()],
    resolve: { alias: { '@': resolve(__dirname, 'src') } },
    server: {
      port: 3002,
      open: true,
      proxy: {
        '/home': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1000, minify: 'terser' as const,
      terserOptions: { compress: { drop_console: false, drop_debugger: true } }
    }
  }
})
