#!/usr/bin/env node
process.cwd()

const fs = require('fs');
const shell = require('shelljs')

const args = process.argv.slice()

let configFile = args[args.indexOf("-c") + 1];

const configs = JSON.parse(fs.readFileSync(configFile));

let tslintExec = `tslint -c ${configs.tslint} "${configs.src}**/*.ts"`;
let crossEnvExec = `cross-env CONFIGFILE=${configFile} node ./node_modules/ts-builder/src/builder.js --color`;

let execCommand = configs.tslint ? `${tslintExec} && ${crossEnvExec}` : crossEnvExec;

shell.exec(execCommand);