import { defineConfig } from "vite";
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [ libInjectCss() ],
    build: {
      minify: 'terser',
      lib: {
        entry: 'src/index.ts',
        formats: ["es"],
      },
      rollupOptions: {
        external: mode === "production" ? "" : /^lit-element/,
        output: {
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'cui[extname]',
          entryFileNames: 'cui.js',
        },
      },
    },
  };
});
