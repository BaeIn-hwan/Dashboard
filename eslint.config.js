import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginReact from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

export default defineConfig([
  globalIgnores(["dist"]),
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{ts,tsx}", "vite.config.ts"],
    ignores: ["dist", "node_modules"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react: pluginReact,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-var": "error",
      "no-alert": "warn",
      "no-console": "warn",
      "no-undef": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "react/self-closing-comp": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./*", "../*"],
              message: "상대경로 대신 alias 경로를 사용하세요.",
            },
          ],
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // node 내장 (fs, path 등)
            "external", // npm 패키지 (react, axios 등)
            "internal", // alias 경로 (@/components 등)
            "parent", // 상위 경로 (../)
            "sibling", // 같은 경로 (./)
            "index", // index 파일
            "type", // type import
            "object", // 스타일(SCSS/CSS 등) — 항상 최하단
          ],
          pathGroups: [
            {
              pattern: "*.scss",
              group: "object",
              position: "after",
              patternOptions: { matchBase: true },
            },
            {
              pattern: "*.css",
              group: "object",
              position: "after",
              patternOptions: { matchBase: true },
            },
            {
              pattern: "*.sass",
              group: "object",
              position: "after",
              patternOptions: { matchBase: true },
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always", // 그룹 사이 빈줄 강제
          alphabetize: {
            order: "asc", // 알파벳 오름차순
            caseInsensitive: true,
          },
        },
      ],
      "import/no-duplicates": "error", // 중복 import 금지

      // import 문과 함수/클래스/변수 등 사이에 무조건 1줄 띄우기
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "import",
          next: [
            "function",
            "class",
            "export",
            "expression",
            "var",
            "let",
            "const",
            "block-like",
          ],
        },
      ],
    },
  },

  {
    files: ["./src/shared/**/*.ts", "./src/shared/**/*.tsx"],
    rules: {
      "no-restricted-imports": "off", // 상대경로 허용!
    },
  },
]);
