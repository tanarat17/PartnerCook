// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.line.me', // ปรับให้ไม่มี /api/notify

        // https://api.line.me/v2/bot/message/push

        
        changeOrigin: true,
        secure: true, // ตั้งค่าเป็น true หากใช้ HTTPS
        rewrite: (path) => path.replace(/^\/api/, 'v2/bot/message/push'), // เปลี่ยน path เพื่อรวมกับ /notify
      },
    },
  },
});
