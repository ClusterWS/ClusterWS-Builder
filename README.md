## TS Builder
Module to simplify rollup typescript applications by providing single `tsbuid.json` file with all configurations.

### Installation
Run:

```
npm -i ts-builder
```

### Cinfig build
Add to your `package.json` scripts:

```
"build": "ts-builder -c ./tsbuild.json"
```

Create `tsbuid.json` file in you project.

### Available Configurations:
```js
{
    // src folder where is all and main ts file placed
    "src": "./src/",
    // main file which is a start point of build
    "main": "index.ts",
    // you can provide tslint if you would like to use it
    "tslint": "./tslint.json",
    // distination folder
    "distFolder": "./dist/",
    // rollup output configs
    "output": {
        // roll up formats iife, cjs, umd check roll up for more info
        "format": "cjs",
        // output file
        "file": "index.js",
        // app name not really used for anything right now
        "name": "My Name app"
    },
    // uglify check rollup-plugin-terser or uglify configs
    "uglify": {
        "mangle": true,
        "output": {
            "beautify": true
        }
    },
    // external moduels which are used in app
    "external": [
        "http",
        "https",
        "crypto"
    ],
    // check Tyscript configs for more info
     "tsConfigs": {
        "compilerOptions": {
            "target": "es6",
            "module": "ES2015",
            "removeComments": true,
            "moduleResolution": "node",
            // if you enable declaration it will be built in dist folder and bind together
            "declaration": true,
            "declarationDir": "./src/"
        },
        "files": [
            "./node_modules/@types/node/index.d.ts"
        ],
        "exclude": [
            "./old_src/**/*.test.ts"
        ],
        "include": [
            "./old_src/**/*"
        ]
    },

    // copy any assets to the dist folder
    "copy": [
        {   // from 
            "src": "./LICENSE",
            // to
            "dist": "./dist/LICENSE"
        },
        {
            "src": "./.github/README.md",
            "dist": "./dist/README.md"
        },
        {
            "src": "./package.json",
            "dist": "./dist/package.json",
            // remove method works only for json files (you can remove any property)
            "remove": [
                "devDependencies",
                "scripts"
            ]
        }
    ]

    // if you would like to run multiple builds with different configs use this:
    // each item in array will be merged with globral configs and ovewrite it 
    "builds": [
        {
            // all same configs as above
            "src": "./app1/"
            "output": {
                "format": "cjs",
                "file": "hello.js",
                "name": "My Name app"
            }
        },
        {
            // all same configs as above
            "src": "./app2/"
            "output": {
                "format": "cjs",
                "file": "play.js",
                "name": "My Name app"
            }
        }
    ]

}
```