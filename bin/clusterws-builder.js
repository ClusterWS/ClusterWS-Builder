#!/usr/bin/env node
process.cwd()

const fs = require('fs');
const shell = require('shelljs')

const args = process.argv.slice()

let configFile = args[args.indexOf("-c") + 1];

const configs = JSON.parse(fs.readFileSync(configFile));

let execCommand = `tslint -c ${configs.tslint} "./${configs.src}/**/*.ts" && cross-env CONFIGFILE=${configFile} `;
execCommand += `node ./node_modules/clusterws-builder/src/builder.js --color`;

shell.exec(execCommand);