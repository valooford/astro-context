import js from '@eslint/js'
import { Linter } from 'eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

type Config = ReturnType<typeof defineConfig>[number]

export default defineConfig([
  globalIgnores(
    ['dist/**/*', 'demo/dist/**/*', 'demo/.astro/**/*'],
    'Ignore irrelevant files',
  ),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  // fix (https://typescript-eslint.io/getting-started/typed-linting/)
  // Error: Error while loading rule '@typescript-eslint/await-thenable':
  // You have used a rule which requires type information, but don't have
  // parserOptions set to generate type information for this file.
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser as Linter.Parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // https://typescript-eslint.io/users/configs
    extends: [
      tseslint.configs.strictTypeChecked as Config,
      tseslint.configs.stylisticTypeChecked as Config,
    ],
    rules: {
      //? namespaces are used to add utility types to classes
      '@typescript-eslint/no-namespace': 0,
      //? actively used
      '@typescript-eslint/no-explicit-any': 0,

      //? allow _underscored ones (https://typescript-eslint.io/rules/no-unused-vars/#what-benefits-does-this-rule-have-over-typescript)
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
])
