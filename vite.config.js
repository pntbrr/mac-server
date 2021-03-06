import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcss from 'postcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001,
    host: "0.0.0.0"
  }
})
