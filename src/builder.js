const fs = require('fs');
const path = require('path');
const rollup = require('rollup').rollup;
const terser = require('rollup-plugin-terser').terser;
const plugins = require('./plugins');
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
  let declarationFile = configs.output.file.split(".").slice(0, -1).join(".");
  configs.output.file = configs.distFolder + configs.output.file;

  return rollup({
    input: `${configs.src}${configs.main}`,
    plugins: [
      typescriptPlugin({
        useTsconfigDeclarationDir: true,
        tsconfigDefaults: configs.tsConfigs,
        tsconfig: undefined,
        cacheRoot: "./node_modules/ts-builder/cache"
      }),
      !configs.uglify || terser(configs.uglify),
      !configs.copy || plugins.copyAssetsPlugin(configs.copy),
      plugins.addExportsPlugin(),
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
        out: path.join(process.env.PWD, `${configs.distFolder}${declarationFile}.d.ts`),
        removeSource: true,
        outputAsModuleFolder: true,
        emitOnIncludedFileNotFound: true
      })
    })
}

run();