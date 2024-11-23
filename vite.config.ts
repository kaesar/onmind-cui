import { defineConfig } from "vite";
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [ libInjectCss() ],
    build: {
      lib: {
        entry: 'src/index.ts',
        formats: ["es"],
        /*entry: {
          'as-box': 'src/as-box.ts',
          'as-button': 'src/as-button.ts',
          'as-check': 'src/as-check.ts',
          'as-confirm': 'src/as-confirm.ts',
          'as-input': 'src/as-input.ts',
          'as-radio': 'src/as-radio.ts',
          'as-select': 'src/as-select.ts',
          'as-text': 'src/as-text.ts',
        },*/
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
