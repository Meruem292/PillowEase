import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This ensures 'process.env.API_KEY' works in the browser for the Gemini SDK
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
      // Polyfill other process.env access if strictly needed, though import.meta.env is preferred for Vite
      'process.env': JSON.stringify(process.env) 
    }
  };
});