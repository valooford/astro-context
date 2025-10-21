//* reload VS Code on config changes

// TODO: Support TS config files https://github.com/prettier/prettier-vscode/issues/3623

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
  semi: false,
  singleQuote: true,

  overrides: [
    {
      files: ['**/*.json', '**/*.json5', '**/*.jsonc'],
      options: {
        trailingComma: 'none',
      },
    },

    //? prettier-plugin-sort-imports throws errors in .md files
    {
      files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.vue'],
      options: {
        plugins: ['@ianvs/prettier-plugin-sort-imports'],

        // https://github.com/IanVS/prettier-plugin-sort-imports
        importOrder: [
          '<TYPES>',
          '',
          '<BUILTIN_MODULES>',
          '<THIRD_PARTY_MODULES>',
          '',
          '^[.]',
        ],
        importOrderTypeScriptVersion: '5.0.0',
        importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
      },
    },

    // https://docs.astro.build/en/editor-setup/#prettier
    // https://github.com/withastro/prettier-plugin-astro
    {
      files: '*.astro',
      options: {
        plugins: [
          'prettier-plugin-astro',
          '@ianvs/prettier-plugin-sort-imports',
        ],
        parser: 'astro',

        // https://github.com/IanVS/prettier-plugin-sort-imports
        importOrder: [
          '<TYPES>',
          '',
          '<BUILTIN_MODULES>',
          '<THIRD_PARTY_MODULES>',
          '',
          '^[.]',
        ],
        importOrderTypeScriptVersion: '5.0.0',
        importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
      },
    },
  ],
}
