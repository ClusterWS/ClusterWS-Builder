const fs = require('fs');
const rollup = require('rollup').rollup;
const terser = require('rollup-plugin-terser').terser;
const filesize = require('rollup-plugin-filesize');
const typescriptPlugin = require('rollup-plugin-typescript2');

const configs = JSON.parse(fs.readFileSync(process.env.CONFIGFILE));
const executionChain = [];

configs.builds ?
  configs.builds.forEach((innerConf) => executionChain.push({ ...configs, ...innerConf })) :
  executionChain.push(configs);

async function run() {
  for (exec of executionChain) {
    // clone object that modification will not affect anything
    await build(JSON.parse(JSON.stringify(exec)));
  }
}

function build(configs) {
  configs.output.file = configs.distFolder + configs.output.file;

  return rollup({
    input: `${configs.src}${configs.main}`,
    plugins: [
      typescriptPlugin({
        useTsconfigDeclarationDir: true,
        tsconfigDefaults: configs.tsConfigs,
        tsconfig: undefined,
        cacheRoot: "./node_modules/clusterws-builder/cache"
      }),
      configs.uglify && terser(configs.uglify),
      filesize()
    ],
    external: configs.external || []
    // { format: configs.format, file: configs.output, name: configs.name }
  })
    .then(bundle => bundle.write(configs.output))
    .then(() => {
      if (!configs.tsConfigs.compilerOptions.declaration) return

      require('dts-bundle').bundle({
        externals: false,
        referenceExternals: false,
        name: "index",
        main: `${configs.src}**/*.d.ts`,
        out: `../${configs.distFolder}/index.d.ts`,
        removeSource: true,
        outputAsModuleFolder: true,
        emitOnIncludedFileNotFound: true
      })
    })
}

run();

  //     typescriptPlugin({
  //       useTsconfigDeclarationDir: true,
  //       tsconfigDefaults: tsConfigOptions,
  //       tsconfig: undefined,
  //       cacheRoot: './node_modules/clusterws-builder/cache'
  //     }),
  //     plugins.addExportsPlugin(),
  //     !(process.env.NPM === 'true') || process.env.NO_ASSETS || plugins.copyAssetsPlugin([
  //       { src: './LICENSE', dist: `./${process.env.DIST}/LICENSE` },
  //       { src: './README.md', dist: `./${process.env.DIST}/README.md` },
  //       { src: './package.json', dist: `./${process.env.DIST}/package.json`, remove: ['devDependencies', 'scripts'] }
  //     ]),
  //     uglify({
  //       mangle: true,
  //       output: {
  //         beautify: !(process.env.MIN === 'true')
  //       }
  //     }),
  //     filesize()
  //   ],
  //   external: ['cluster', 'http', 'https', 'uws', 'crypto']
  // }).then((bundle) => bundle.write({ format: process.env.FORMAT, file: `./${process.env.DIST}/${process.env.DISTFILE}`, name: process.env.NAME }).then(() => {
  //   if (!(process.env.NPM === 'true')) return

  //   require('dts-bundle').bundle({
  //     externals: false,
  //     referenceExternals: false,
  //     name: "index",
  //     main: `./${process.env.SRC}/**/*.d.ts`,
  //     out: `../${process.env.DIST}/index.d.ts`,
  //     removeSource: true,
  //     outputAsModuleFolder: true,
  //     emitOnIncludedFileNotFound: true
  //   })
// });


// const plugins = require('./plugins')

// const tsConfigOptions = JSON.parse(fs.readFileSync(process.env.TSCONF))

// if (process.env.NPM === 'true') {
//   tsConfigOptions.compilerOptions['declaration'] = true
//   tsConfigOptions.compilerOptions['declarationDir'] = `./${process.env.SRC}`
// }

// if (process.env.TYPE === 'node' && (!tsConfigOptions.compilerOptions['moduleResolution'] || tsConfigOptions.compilerOptions['moduleResolution'] !== 'node')) {
//   tsConfigOptions.compilerOptions['moduleResolution'] = 'node'
//   tsConfigOptions.compilerOptions['target'] = 'es6'
// }

// if (process.env.TSCONF === './node_modules/clusterws-builder/tsconfig.json' && process.env.TYPE !== 'node')
//   delete tsConfigOptions['files']

// tsConfigOptions.include = [
//   `./${process.env.SRC}/**/*.ts`
// ]

// tsConfigOptions.exclude = [
//   `./${process.env.SRC}/**/*.test.ts`
// ]
