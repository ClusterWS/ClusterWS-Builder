const fs = require('fs')
const path = require('path')

function addExportsPlugin() {
  return {
    name: 'add_export',
    transformBundle(code) {
      let result = code
      let matchingModules = code.match(/(module.exports =(.*))/g)

      if (matchingModules) {
        for (let i = 0; i < matchingModules.length; i++) {
          let name = matchingModules[i].split('module.exports =')[1]
          result = result.replace('module.exports =' + name, 'module.exports =' + name + ' module.exports.default =' + name)
        }
      }

      let matchingExports = code.match(/(exports.default =(.*))/g)
      if (matchingExports) {
        for (let i = 0; i < matchingExports.length; i++) {
          let name = matchingExports[i].split('exports.default =')[1]
          result = result.replace('exports.default =' + name, 'exports.default =' + name + ' module.exports = exports["default"]')
        }
      }

      return result
    }
  }
}


function copyAssetsPlugin(options) {
  return {
    ongenerate() {
      options.forEach(item => {
        if (!fs.existsSync(item.src)) {
          item.src = item.src.replace('./', './.github/')

          if (!fs.existsSync(item.src))
            item.src = item.src.replace('./.github/', './docs/')

          if (!fs.existsSync(item.src)) return
        }
        const distPath = path.dirname(item.dist)

        if (!fs.existsSync(distPath))
          fs.mkdirSync(distPath)

        if (item.remove) {
          const json = fs.readFileSync(item.src)
          const parsed = JSON.parse(json)
          item.remove.forEach((prop) => delete parsed[prop])
          fs.writeFileSync(item.dist, JSON.stringify(parsed, null, '\t'))
        } else fs.writeFileSync(item.dist, fs.readFileSync(item.src))
      })
    }
  }
}

module.exports = {
  copyAssetsPlugin,
  addExportsPlugin
}