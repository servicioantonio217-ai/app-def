
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Esto hace que la variable de entorno de Vercel (API_KEY) 
    // esté disponible en el código de la aplicación.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
})
