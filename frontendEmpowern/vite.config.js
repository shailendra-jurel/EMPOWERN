


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': '/src'
//     }
//   },
//   define: {
//     'process.env.NODE_ENV': JSON.stringify(import.meta.env.NODE_ENV || 'development')
//   },

//   server: {
//     port: 5173,
//     open: true
//   }


// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },

  // optimizeDeps: {
  //   include: ['lucide-react']
  // },
});