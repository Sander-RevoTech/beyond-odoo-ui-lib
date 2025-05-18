export default {
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-sort-json'],
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
  proseWrap: 'preserve',
  quoteProps: 'consistent',
  typescript: true,

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
