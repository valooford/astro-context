import fs from 'node:fs/promises'
import path from 'node:path'
import { TSDocConfiguration, TSDocParser } from '@microsoft/tsdoc'

/** @see {@link https://github.com/microsoft/tsdoc/blob/main/api-demo/src/simpleDemo.ts} */

/**
 * Copies the first \@packageDocumentation-tagged comment from the entry file to the resulting d.ts file.
 */
async function preservePackageDocumentation(
  srcPath: string,
  distPath?: string,
) {
  const entry = await fs.readFile(path.join('src', srcPath), 'utf-8')

  const parser = new TSDocParser(new TSDocConfiguration())
  const parserContext = parser.parseString(entry)

  if (
    parserContext.docComment.modifierTagSet.hasTagName('@packageDocumentation')
  ) {
    const dtsPath = path.join(
      'dist',
      distPath ?? `${srcPath.slice(0, -path.extname(srcPath).length)}.d.ts`,
    )
    const dts = await fs.readFile(dtsPath)
    // The `/**/` prefix prevents the @packageDocumentation comment being duplicated after running the API Extractor.
    // There must be an additional line break between @packageDocumentation and the first type declaration,
    // or the first type declaration must have its own TSDoc comment.
    await fs.writeFile(
      dtsPath,
      `${parserContext.docComment.emitAsTsdoc()}\n${dts.toString()}`,
      'utf-8',
    )
  }
}

const [srcPath, distPath] = process.argv.slice(2)

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
await preservePackageDocumentation(srcPath || './index.ts', distPath)
