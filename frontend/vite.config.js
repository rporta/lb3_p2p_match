import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import path from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default async ({ mode }) => {

  // Cargamos las .env[mode], a process.env
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  return  defineConfig({
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
      basicSsl(),
      {
        name: 'log-launch-editor',
        configResolved(config) {
          console.log('--- DEBUG LAUNCH EDITOR ---');
          console.log('process.env.LAUNCH_EDITOR:', process.env.LAUNCH_EDITOR);
          console.log('config.server.open:', config.server?.open);
          console.log('---------------------------');
        }
      }
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
      port: 3000,
      host: true,
    },
  })
}

