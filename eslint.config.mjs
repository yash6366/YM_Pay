import nextPlugin from "@next/eslint-plugin-next"
import hooksPlugin from "eslint-plugin-react-hooks"
import tsParser from "@typescript-eslint/parser"

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      ".vercel/**",
      "dist/**",
      "build/**",
      "*.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": hooksPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
]

export default eslintConfig
