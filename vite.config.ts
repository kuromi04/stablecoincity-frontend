import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    {
      name: 'dynamic-tonconnect-manifest',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ? req.url.split('?')[0] : '';
          if (url === '/tonconnect-manifest.json') {
            let protocol = req.headers['x-forwarded-proto'] || (req.headers['referer']?.startsWith('https') ? 'https' : 'http');
            const host = req.headers['x-forwarded-host'] || req.headers.host || '';
            
            // Forzar HTTPS en túneles externos/dominios para compatibilidad con wallets de TON
            if (typeof protocol === 'string' && protocol !== 'https') {
              if (!host.includes('localhost') && !host.includes('127.0.0.1') && !host.includes('192.168.')) {
                protocol = 'https';
              }
            }
            const origin = `${protocol}://${host}`;
            
            const manifest = {
              url: origin,
              name: "StablecoinCity",
              iconUrl: "https://ton.org/static/my_dash_logo.png",
              description: "Marketplace de Skills para Termux y AI"
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(manifest, null, 2));
            return;
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ? req.url.split('?')[0] : '';
          if (url === '/tonconnect-manifest.json') {
            let protocol = req.headers['x-forwarded-proto'] || (req.headers['referer']?.startsWith('https') ? 'https' : 'http');
            const host = req.headers['x-forwarded-host'] || req.headers.host || '';
            
            // Forzar HTTPS en túneles externos/dominios para compatibilidad con wallets de TON
            if (typeof protocol === 'string' && protocol !== 'https') {
              if (!host.includes('localhost') && !host.includes('127.0.0.1') && !host.includes('192.168.')) {
                protocol = 'https';
              }
            }
            const origin = `${protocol}://${host}`;
            
            const manifest = {
              url: origin,
              name: "StablecoinCity",
              iconUrl: "https://ton.org/static/my_dash_logo.png",
              description: "Marketplace de Skills para Termux y AI"
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(manifest, null, 2));
            return;
          }
          next();
        });
      }
    }
  ],
})
