// https://nuxt.com/docs/api/configuration/nuxt-config
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

export default defineNuxtConfig({
  ssr: false,
  css: [
    '@nimiq/style/nimiq-style.min.css', // find available nimiq classes: https://github.com/nimiq/nimiq-style/tree/master
    '@nimiq/vue3-components/css',
    'assets/css/styles.css',
    'assets/css/fonts.css',
    'assets/css/utilities.css',
  ],
  modules: ['@nuxtjs/tailwindcss'],
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
    plugins: [wasm(), topLevelAwait()],
    worker: {
      // Not needed with vite-plugin-top-level-await >= 1.3.0
      // format: "es",
      plugins: [wasm(), topLevelAwait()],
    },
    optimizeDeps: {
      exclude: ['@nimiq/core-web'],
    },
  },
});
