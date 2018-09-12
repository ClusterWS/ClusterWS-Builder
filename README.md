## TS Builder
Module to simplify rollup typescript applications by providing single `tsbuid.json` file with all configurations:

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

    // if you would like to run multiple builds with different configs use this:
    // each item in array will be merged with globral configs and ovewrite it 
    "builds": [
        {
            "src": "./app1/"
            // all same configs as above
            "output": {
                "format": "cjs",
                "file": "hello.js",
                "name": "My Name app"
            }
        },
        {
            "src": "./app2/"
            // all same configs as above
            "output": {
                "format": "cjs",
                "file": "play.js",
                "name": "My Name app"
            }
        }
    ]

}
```