import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    flowbiteReact(),
    VitePWA({
      registerType: "prompt",
      injectRegister: null,
      manifest: false,
      outDir: "build/client",
      workbox: {
        globPatterns: ["**/*.css", "404.html", "ghspa.js"],
        additionalManifestEntries: [{ url: "index.html", revision: packageJson.version }],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /\/assets\/[^/]+\.js$/,
            handler: "CacheFirst",
            options: {
              cacheName: "app-chunks",
              expiration: { maxEntries: 250, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/mypreflight-files": "http://localhost:8080",
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    include: ["recharts"],
  },
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
  },
});
