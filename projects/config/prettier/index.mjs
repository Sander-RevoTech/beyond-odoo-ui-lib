export default {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-sort-json', // ✅ Ajout du plugin pour trier les clés des objets
  ],
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: true,
  bracketSpacing: true,
  arrowParens: 'avoid',
  trailingComma: 'es5',
  bracketSameLine: false,
  printWidth: 120,
  endOfLine: 'auto',

  // ✅ Empêcher la suppression des types génériques
  proseWrap: 'preserve',
  quoteProps: 'consistent',
  typescript: true,

  // 📌 Ignorer certains fichiers
  overrides: [
    {
      files: ['*.d.ts'],
      options: { requirePragma: true },
    },
    {
      files: ['package.json'],
      options: { tabWidth: 2 },
    },
  ],

  // ✅ Tri et organisation des imports
  importOrder: [
    '^@angular/(.*)$',
    '^rxjs/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@camelot/(.*)$',
    '^src/(.*)$',
    '^[../]',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
};
