import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  js.configs.recommended, // Règles de base ESLint
  {
    ignores: ['**/dist/**/*', '**/node_modules/**/*'], // Exclure les dossiers dist et node_modules
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        createDefaultProgram: true,
        project: ['tsconfig.json', 'e2e/tsconfig.json'],
      },
      globals: {
        console: 'readonly', // Permet d'utiliser `console` sans erreur
        window: 'readonly', // Ajoute `window` si besoin (navigateur)
        document: 'readonly',
        process: 'readonly', // Ajoute `process` si besoin (Node.js)
      },
    },
    plugins: {
      '@angular-eslint': angular,
      '@typescript-eslint': tseslint,
      prettier,
      'unused-imports': unusedImports,
    },
    rules: {
      '@angular-eslint/component-class-suffix': ['error', { suffixes: ['Page', 'Component', 'Modal'] }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'no-unused-vars': 'off', // Désactive la règle de base
      'sort-keys': ['error', 'asc', { caseSensitive: false, natural: true }],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unnecessary-type-arguments': 'off', // Désactive la suppression des génériques inutiles
      '@typescript-eslint/no-explicit-any': 'warn', // Permet d'éviter que ESLint supprime les types explicites
    },
  },
  {
    files: ['*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
    },
  },
];
