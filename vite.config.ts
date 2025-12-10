import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // פותח אוטומטית בדפדפן
    host: true
  },
  base: './', // חשוב ל-Capacitor - נתיבים יחסיים
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
