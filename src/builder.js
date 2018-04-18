const fs = require('fs')
const rollup = require('rollup').rollup
const uglify = require('rollup-plugin-uglify')
const plugins = require('./plugins')
const filesize = require('rollup-plugin-filesize')
const typescriptPlugin = require('rollup-plugin-typescript2')

const tsConfigOptions = JSON.parse(fs.readFileSync(process.env.TSCONF))

if (process.env.NPM === 'true') {
  tsConfigOptions.compilerOptions['declaration'] = true
  tsConfigOptions.compilerOptions['declarationDir'] = `./${process.env.SRC}`
}

if (process.env.TYPE === 'node' && (!tsConfigOptions.compilerOptions['moduleResolution'] || tsConfigOptions.compilerOptions['moduleResolution'] !== 'node')) {
  tsConfigOptions.compilerOptions['moduleResolution'] = 'node'
  tsConfigOptions.compilerOptions['target'] = 'es6'
}

if (process.env.TSCONF === './node_modules/clusterws-builder/tsconfig.json' && process.env.TYPE !== 'node')
  delete tsConfigOptions['files']

tsConfigOptions.include = [
  `./${process.env.SRC}/**/*.ts`
]

return rollup({
  input: `./${process.env.SRC}/${process.env.SRCFILE}`,
  plugins: [
    typescriptPlugin({
      useTsconfigDeclarationDir: true,
      tsconfigDefaults: tsConfigOptions,
      tsconfig: undefined,
      cacheRoot: './node_modules/clusterws-builder/cache'
    }),
    plugins.addExportsPlugin(),
    !(process.env.NPM === 'true') || plugins.copyAssetsPlugin([
      { src: './LICENSE', dist: `./${process.env.DIST}/LICENSE` },
      { src: './README.md', dist: `./${process.env.DIST}/README.md` },
      { src: './package.json', dist: `./${process.env.DIST}/package.json`, remove: ['devDependencies', 'scripts'] }
    ]),
    uglify({
      mangle: true,
      output: {
        beautify: !(process.env.MIN === 'true')
      }
    }),
    filesize()
  ],
  external: ['cluster', 'http', 'https', 'uws', 'crypto']
}).then((bundle) => bundle.write({ format: process.env.FORMAT, file: `./${process.env.DIST}/${process.env.DISTFILE}`, name: process.env.NAME }).then(() => {
  if (!(process.env.NPM === 'true')) return

  require('dts-bundle').bundle({
    externals: false,
    referenceExternals: false,
    name: "index",
    main: `./${process.env.SRC}/**/*.d.ts`,
    out: `../${process.env.DIST}/index.d.ts`,
    removeSource: true,
    outputAsModuleFolder: true,
    emitOnIncludedFileNotFound: true
  })
}))