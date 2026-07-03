
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// قائمة المفاتيح التي قد يوفرها Vercel أو Supabase Integration
const envKeys = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY'
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const mergedEnv = { ...process.env, ...env };

  const processEnv: Record<string, string | undefined> = {};
  envKeys.forEach(key => {
    if (mergedEnv[key]) {
      processEnv[key] = mergedEnv[key];
    }
  });

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['**/*'],
        manifest: {
          name: 'مركز القيادة والسيطرة الجغرافي',
          short_name: 'قيادة وسيطرة',
          description: 'منصة قيادة وسيطرة تكتيكية لتتبع الوحدات الميدانية وإدارة العمليات الأمنية',
          theme_color: '#020617',
          background_color: '#020617',
          display: 'standalone',
          orientation: 'any',
          dir: 'rtl',
          lang: 'ar',
          icons: [
            { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
            { src: '/icons/icon-192.svg', sizes: '512x512', type: 'image/svg+xml' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/unpkg\.com\/leaflet/,
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'leaflet-cache' },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com|fonts\.gstatic\.com/,
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'font-cache' },
            },
            {
              urlPattern: /^https:\/\/[^.]+\.supabase\.co/,
              handler: 'NetworkFirst',
              options: { cacheName: 'api-cache' },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        '@components': path.resolve(__dirname, './components'),
        '@services': path.resolve(__dirname, './services')
      },
    },
    define: {
      'process.env': JSON.stringify(processEnv)
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor-react';
            if (id.includes('node_modules/leaflet')) return 'vendor-leaflet';
            if (id.includes('node_modules/@supabase/supabase-js')) return 'vendor-supabase';
            if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
            if (id.includes('node_modules')) return 'vendor-other';
          }
        }
      }
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './test/setup.ts',
      coverage: {
        provider: 'v8'
      }
    }
  };
});
