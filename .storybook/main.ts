import type { StorybookConfig } from "@storybook/react-vite";
import type { PluginOption } from "vite";

const APP_ONLY_PLUGINS = ["react-router", "prerender", "vite-plugin-pwa"];

function flatten(plugins: PluginOption[]): PluginOption[] {
  return plugins.flatMap((plugin) => (Array.isArray(plugin) ? flatten(plugin) : [plugin]));
}

function isAppOnly(plugin: PluginOption): boolean {
  return (
    typeof plugin === "object" &&
    plugin !== null &&
    "name" in plugin &&
    APP_ONLY_PLUGINS.some((prefix) => plugin.name.startsWith(prefix))
  );
}

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  core: { disableTelemetry: true },
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: flatten(viteConfig.plugins ?? []).filter((plugin) => !isAppOnly(plugin)),
  }),
};

export default config;
