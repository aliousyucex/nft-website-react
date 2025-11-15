import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5001,
    proxy: {
      '/api': {
        target: 'https://api.ivorynfts.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    VITE_API_URL: JSON.stringify(process.env.VITE_API_URL || 'https://api.ivorynfts.com'), // 'https://api.ivorynfts.com'),
    VITE_WS_URL: JSON.stringify(process.env.VITE_WS_URL || 'wss://api.ivorynfts.com'), // 'wss://api.ivorynfts.com'),
    VITE_CONTRACT_ADDRESS: JSON.stringify(process.env.VITE_CONTRACT_ADDRESS || '0x3A895aeA91388f6b44227CDb565FDb04a8A81C79'),
    VITE_CHAIN_ID: JSON.stringify(process.env.VITE_CHAIN_ID || '0x2B74'),
    VITE_WALLETCONNECT_PROJECT_ID: JSON.stringify(process.env.VITE_WALLETCONNECT_PROJECT_ID || ''),
  }
})
