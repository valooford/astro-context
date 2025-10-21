import type { Options } from 'tsdown'

import { defineConfig } from 'tsdown'

const nodeTs = (scriptAndArgs: string) =>
  `node --experimental-strip-types ${scriptAndArgs}`

export default defineConfig((options) => {
  const dts: Options['dts'] = {
    //? do not use cache when updating dts (https://github.com/sxzz/rolldown-plugin-dts?tab=readme-ov-file#newcontext)
    newContext: options.watch === true,
  }

  const onSuccess: string[] = []
  if (!options.watch) {
    onSuccess.push(
      'tsup --config config/tsup.config.ts',
      nodeTs('./config/scripts/preservePackageDocumentation.ts'),
      'api-extractor run --local --verbose',
    )
  }

  return [
    {
      entry: ['src/index.ts'],
      hash: false,
      target: 'esnext',
      dts,
      skipNodeModulesBundle: true,

      //? still checks syntax and fails on `import type` constructs (Unexpected token `type`)
      // loader: {
      //   '.astro': 'asset',
      // },
      external: ['./ContextProvider', './ContextProvider.astro'],
      outputOptions: {
        assetFileNames: '[name][extname]',
      },
      onSuccess: onSuccess.join(' && '),
    },
  ]
})
