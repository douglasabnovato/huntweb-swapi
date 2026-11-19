/* ESLint 10 (configuração plana): regras recomendadas do JavaScript e dos hooks do React; o ESLint 10 já reconhece o uso de componentes no JSX */
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["build/", "node_modules/", "playwright-report/", "test-results/"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  /* Configurações, testes de navegador e testes do Vitest rodam no Node */
  {
    files: ["*.config.js", "e2e/**/*.js", "src/__tests__/**/*.{js,jsx}"],
    languageOptions: { globals: { ...globals.node } },
  },
];
/* Fim de eslint.config.js */
