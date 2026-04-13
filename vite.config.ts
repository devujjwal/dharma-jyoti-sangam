import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: false },
      includeAssets: ["favicon.ico", "icon-192.png", "icon-512.png"],
      manifest: false, // we already have public/manifest.json
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        navigateFallbackDenylist: [/^\/~oauth/, /^\/api/],
        runtimeCaching: [
          // Static assets — cache first, long TTL
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets",
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
          // Supabase edge functions (panchang, horoscope, AI) — network first, short cache
          {
            urlPattern: /\/functions\/v1\/(panchang|daily-horoscope|ai-astrologer|sitemap)/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "sacred-data",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 }, // 1 hour
              networkTimeoutSeconds: 10,
            },
          },
          // Supabase REST API (DB queries) — network first, brief fallback
          {
            urlPattern: /\/rest\/v1\//i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-data",
              expiration: { maxEntries: 200, maxAgeSeconds: 5 * 60 }, // 5 min
              networkTimeoutSeconds: 8,
            },
          },
          // Supabase auth — network only, never cache
          {
            urlPattern: /\/auth\/v1\//i,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
