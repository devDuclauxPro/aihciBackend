import globals from "globals";
import tseslint from "typescript-eslint";

import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended
});

export default [
  { languageOptions: { globals: globals.node } },
  ...compat.extends("xo-typescript"),
  ...compat.config({
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
      "@typescript-eslint/quotes": "off",
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/semi": "off",
      "@typescript-eslint/member-delimiter-style": "off",
      "@typescript-eslint/comma-dangle": "off",
      "@typescript-eslint/object-curly-spacing": "off",
      "@/eqeqeq": "error",
      "prettier/prettier": "error"
    },
    ignorePatterns: ["eslint.config.mjs", "tsconfig.json", "dist"]
  }),
  ...tseslint.configs.recommended
];
