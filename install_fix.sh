#!/bin/bash
cd frontend
rm -rf node_modules
mkdir node_modules
npm install react react-dom vite @vitejs/plugin-react @tonconnect/ui-react lucide-react vite-plugin-node-polyfills --save --prefix . --no-bin-links
