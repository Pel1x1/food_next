import nextPlugin from "eslint-config-next";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    ignores: ["**/.next/**", "**/node_modules/**", "**/dist/**"],
  },
  ...tseslint.config(
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        parserOptions: {
          project: "./tsconfig.json",
        },
        globals: {
          ...globals.browser,
          ...globals.node,
        },
      },
      plugins: {
        "react-hooks": reactHooks,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
      },
    },
    nextPlugin()
  ),
];

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
