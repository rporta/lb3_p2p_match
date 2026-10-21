// vite.config.js
import { defineConfig } from "file:///C:/Users/Ramiro%20Ariel%20Portas/Desktop/proyectos/lb3_p2p_match/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/Ramiro%20Ariel%20Portas/Desktop/proyectos/lb3_p2p_match/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///C:/Users/Ramiro%20Ariel%20Portas/Desktop/proyectos/lb3_p2p_match/frontend/node_modules/unplugin-vue-components/dist/vite.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\Ramiro Ariel Portas\\Desktop\\proyectos\\lb3_p2p_match\\frontend";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    // Solo dejamos la auto-importación para tus componentes personalizados UI
    Components({
      dirs: [
        "src/common/components/ui"
      ],
      extensions: ["vue"],
      deep: true,
      dts: false
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "../backend/client"),
    emptyOutDir: true
  },
  server: {
    port: 3e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSYW1pcm8gQXJpZWwgUG9ydGFzXFxcXERlc2t0b3BcXFxccHJveWVjdG9zXFxcXGxiM19wMnBfbWF0Y2hcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFJhbWlybyBBcmllbCBQb3J0YXNcXFxcRGVza3RvcFxcXFxwcm95ZWN0b3NcXFxcbGIzX3AycF9tYXRjaFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvUmFtaXJvJTIwQXJpZWwlMjBQb3J0YXMvRGVza3RvcC9wcm95ZWN0b3MvbGIzX3AycF9tYXRjaC9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIC8vIFNvbG8gZGVqYW1vcyBsYSBhdXRvLWltcG9ydGFjaVx1MDBGM24gcGFyYSB0dXMgY29tcG9uZW50ZXMgcGVyc29uYWxpemFkb3MgVUlcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICBkaXJzOiBbXHJcbiAgICAgICAgJ3NyYy9jb21tb24vY29tcG9uZW50cy91aScsXHJcbiAgICAgIF0sXHJcbiAgICAgIGV4dGVuc2lvbnM6IFsndnVlJ10sXHJcbiAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgIGR0czogZmFsc2UsXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJylcclxuICAgIH1cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9iYWNrZW5kL2NsaWVudCcpLFxyXG4gICAgZW1wdHlPdXREaXI6IHRydWVcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMzAwMFxyXG4gIH1cclxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQW1aLFNBQVMsb0JBQW9CO0FBQ2hiLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBO0FBQUEsSUFFSixXQUFXO0FBQUEsTUFDVCxNQUFNO0FBQUEsUUFDSjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQVksQ0FBQyxLQUFLO0FBQUEsTUFDbEIsTUFBTTtBQUFBLE1BQ04sS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVEsS0FBSyxRQUFRLGtDQUFXLG1CQUFtQjtBQUFBLElBQ25ELGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
