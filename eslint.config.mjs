import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-no-useless-fragment": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/no-unused-prop-types": "off",
      "react/no-unused-state": "off",
      "react/no-type": "off",
      "react/no-unescaped-entities": "off",

      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",

      "no-unused-vars": "warn",
      "no-console": "warn",
      "arrow-body-style": "off",
    },
    ignores : [
      "node_modules",
      "dist",
      "build",
      "out",
      "coverage",
      "public",
      "tmp",
      "temp",
      "vendor",
      ".*",
      ".*.*",
      ".*.*.*",
      ".*.*.*.*",
      ".*.*.*.*.*",
      ".*.*.*.*.*.*",
      ".*.*.*.*.*.*.*",
      ".*.*.*.*.*.*.*.*",
      ".*.*.*.*.*.*.*.*.*",
      ".next",
      "next",
    ]
  }
]; 
