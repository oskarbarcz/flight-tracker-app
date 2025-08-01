import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), flowbiteReact()],
});
