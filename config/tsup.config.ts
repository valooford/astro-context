import type { Options } from 'tsup'

import { defineConfig } from 'tsup'

export default defineConfig(() => {
  const common: Options = {
    // outDir: 'dist', //* (1)
    format: ['esm'],
    splitting: false,
    // minify: true,
    dts: true,
    treeshake: true,
    /// generation finishes after next step being executed already
    /// causes a race condition (unwanted clears/overwrites)
    esbuildOptions(options) {
      options.assetNames = '[name]'
      //* (1)
      // options.outbase = 'src' //? dts gets generated in /dist root
    },
  }
  const framework = (name: string): Options => ({
    ...common,
    entry: [`src/${name}/index.ts`],
    outDir: `dist/${name}`,
    external: ['../index'],
  })

  /// order is important: tsdown(index) -> tsup(...frameworks) -> tsup(astro)
  /// ensures correct dts generation (nothing is cleared ahead)
  return [
    framework('react'),
    framework('preact'),
    framework('solid'),
    framework('vue'),
    framework('svelte'),
    {
      ...common,
      entry: [
        // 'src/index.ts', //? fails due to *.astro imports
        'src/ContextProvider.astro',
        'src/ContextProvider.ts',
      ],
      outDir: 'dist',
      bundle: false,

      loader: {
        '.astro': 'copy',
      } as Record<string, 'copy'>,

      // external: ['./index', './ContextProvider'],
      /// dts workaround 1 //? not bundled --> too many files
      // onSuccess: 'tsc -p tsconfig.dts.json',
      /// dts workaround 2 //* bundled + *.astro files are treated as external modules
      // onSuccess: 'tsdown',
    },
  ]
})
