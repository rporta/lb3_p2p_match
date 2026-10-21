import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    // Solo dejamos la auto-importación para tus componentes personalizados UI
    Components({
      dirs: [
        'src/common/components/ui',
      ],
      extensions: ['vue'],
      deep: true,
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../backend/client'),
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
})