// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import * as fs from "fs";
import { ReleaseNumber } from "./src/mixins/createReleaseNumber";

const packageJson = String(fs.readFileSync("./package.json"));
const packageData = JSON.parse(packageJson);
const packageVersionText = packageData.version || "0.0.0";
//const versionText = doSomethingToAddBuildDateAndTimeOrSomething(packageVersionText);

const releaseNumber = ReleaseNumber + '';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/connections/',
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    vuetify({
      autoImport: true
    }),
    ViteFonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
  ],
  define: {
    'process.env': {},
    '__APP_VERSION__': `"v${releaseNumber}"`
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://www.nytimes.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
