import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite para el frontend de Vault.
// La URL de la API se define con la variable VITE_API_URL (ver .env.example).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
});
