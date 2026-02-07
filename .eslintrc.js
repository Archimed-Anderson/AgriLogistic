module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // Intégration Prettier
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react-refresh', 'import'],
  rules: {
    // Règles strictes demandées par PROMPT 6
    '@typescript-eslint/no-explicit-any': 'error', // Interdiction stricte de 'any'
    'no-console': ['error', { allow: ['warn', 'error'] }], // Interdiction de console.log (sauf warn/error)
    
    // Autres bonnes pratiques
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'import/no-unresolved': 'off', // Géré par TypeScript
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      // Exception: Autoriser console.log dans les scripts et tests
      files: ['scripts/**/*.js', 'tests/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off', // Souvent nécessaire dans les tests complexes
      },
    },
  ],
  ignorePatterns: ['dist', 'node_modules', 'coverage', '.eslintrc.cjs'],
};
