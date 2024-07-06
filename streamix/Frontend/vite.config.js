import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexões externas
    port: 5173, // Define a porta padrão (já está correta)
    strictPort: true, // Garante que se a porta 5173 estiver ocupada, o Vite não usará uma porta diferente
  }
})