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
        globPatterns: ["**/*.{js,css,html}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
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
