#!/usr/bin/env node
process.cwd()

const shell = require('shelljs')

const args = process.argv.slice()

let fullArguments = {}

const availableArguments = {
  '-min': () => fullArguments['min'] = true,
  '-npm': () => fullArguments['npm'] = true,
  '-type': (str) => fullArguments['type'] = str.substring(str.lastIndexOf("=") + 1),
  '-src': (str) => fullArguments['src'] = str.substring(str.lastIndexOf("=") + 1),
  '-srcFile': (str) => fullArguments['srcFile'] = str.substring(str.lastIndexOf("=") + 1),
  '-dist': (str) => fullArguments['dist'] = str.substring(str.lastIndexOf("=") + 1),
  '-distFile': (str) => fullArguments['distFile'] = str.substring(str.lastIndexOf("=") + 1),
  '-format': (str) => fullArguments['format'] = str.substring(str.lastIndexOf("=") + 1),
  '-tslint': (str) => fullArguments['tslint'] = str.substring(str.lastIndexOf("=") + 1),
  '-tsconf': (str) => fullArguments['tsconf'] = str.substring(str.lastIndexOf("=") + 1)
}

args.forEach(arg => {
  if (arg === '-min' || arg === '-npm')
    return availableArguments[arg] && availableArguments[arg]()
  availableArguments[arg.substring(0, arg.lastIndexOf('='))] && availableArguments[arg.substring(0, arg.lastIndexOf('='))](arg)
})

fullArguments = {
  MIN: fullArguments.min || false,
  NPM: fullArguments.npm || false,
  TYPE: fullArguments.type || 'node',
  SRC: fullArguments.src || 'src',
  SRCFILE: fullArguments.srcFile || 'index.ts',
  DIST: fullArguments.dist || 'dist',
  DISTFILE: fullArguments.distFile || 'index.js',
  FORMAT: fullArguments.format || 'cjs',
  TSLINT: fullArguments.tslint || './node_modules/clusterws-builder/tslint.json',
  TSCONF: fullArguments.tsconf || './node_modules/clusterws-builder/tsconfig.json'
}

let execCommand = `tslint -c ${fullArguments.TSLINT} "./${fullArguments.SRC}/**/*.ts" && cross-env `

for (key in fullArguments) {
  if (fullArguments.hasOwnProperty(key))
    execCommand += `${key}=${fullArguments[key]} `
}

execCommand += `node ./node_modules/clusterws-builder/src/builder.js --color`

shell.exec(execCommand)