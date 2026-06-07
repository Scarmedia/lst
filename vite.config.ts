import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    serverFns: { disableCsrfMiddlewareWarning: true },
    importProtection: {
      enabled: false,
    },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.png", "og-image.png"],
        manifest: {
          name: "Scar Media — المكتبة",
          short_name: "Scar Media",
          description: "تصفّح وحمّل الأفلام والمسلسلات التركية والأجنبية والألعاب",
          theme_color: "#0d0d0d",
          background_color: "#0d0d0d",
          display: "standalone",
          orientation: "portrait",
          lang: "ar",
          dir: "rtl",
          start_url: "/",
          icons: [
            { src: "favicon.png", sizes: "192x192", type: "image/png" },
            { src: "favicon.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "favicon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          runtimeCaching: [
            {
              urlPattern: /^https?:\/\/.*\/api\/.*/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
              },
            },
          ],
        },
      }),
    ],
  },
});
