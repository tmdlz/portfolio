import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // ← chemin relatif, marche partout
  build: {
    outDir: '../devops-dashboard-build',  // sort dans le dossier parent
  }
})
