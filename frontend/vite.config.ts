import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0005-220-76-70-1.ngrok-free.app'
    ]
  }
});
