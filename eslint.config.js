import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["app/**/*.{js,ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "18",
      },
      "better-tailwindcss": {
        entryPoint: "src/app.css",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    plugins: {
      "react-hooks": hooks,
    },
    rules: hooks.configs.recommended.rules,
  },
];
