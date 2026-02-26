import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  root: 'src',
  plugins: [viteSingleFile()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000
  }
})
