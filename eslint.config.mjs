// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const tsRules = {
  ...tsPlugin.configs.recommended.rules,

  // Allow `void` expressions for fire-and-forget async calls
  '@typescript-eslint/no-floating-promises': 'error',

  // Prefer type imports to keep the runtime bundle lean
  '@typescript-eslint/consistent-type-imports': [
    'warn',
    { prefer: 'type-imports', disallowTypeAnnotations: false },
  ],

  // Allow non-null assertions — used deliberately
  '@typescript-eslint/no-non-null-assertion': 'off',

  // Warn rather than error on explicit any
  '@typescript-eslint/no-explicit-any': 'warn',

  // Prefer const
  'prefer-const': 'error',

  // Let TypeScript's no-unused-vars handle this (with underscore escape hatch)
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
};

export default [
  js.configs.recommended,

  // ── Extension host (Node.js) ────────────────────────────────────────────────
  {
    files: ['src/**/*.ts'],
    ignores: ['src/webview/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsRules,
      // Buffer/process/setTimeout etc. are Node globals — no-undef is redundant
      // when TypeScript's strict mode is active; disable it for Node files.
      'no-undef': 'off',
    },
  },

  // ── Webview (browser / React) ───────────────────────────────────────────────
  {
    files: ['src/webview/**/*.ts', 'src/webview/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsRules,
      'no-undef': 'off',
    },
  },

  // ── Build scripts (plain CJS, no type-checking) ─────────────────────────────
  {
    files: ['esbuild.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },

  // Prettier must be last — disables all formatting rules ESLint owns,
  // then adds a single `prettier/prettier` rule that reports formatting issues.
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: { 'prettier/prettier': 'warn' },
  },

  { ignores: ['dist/**', 'node_modules/**'] },
];
