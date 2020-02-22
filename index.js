const loaderUtils = require('loader-utils')
const { CACHE_DIR, getSymbols, encodeSvg } = require('./utils')

module.exports = async function(fileId) {
  const query = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : {}
  const { cache } = this._compiler.options
  const options = { cache, fileId, ...loaderUtils.getOptions(this), ...query }
  if (this.cacheable) { this.cacheable(true) }
  const callback = this.async()
  this.addDependency(this.resourcePath)
  this.addDependency(CACHE_DIR)
  const symbols = await getSymbols(options)
  if (options.frame) {
    const symbol = symbols.find(({ frame }) => options.frame === frame)
    callback(null, `module.exports = ${JSON.stringify(encodeSvg(symbol.data, options.color))}`)
  } else {
    const result = symbols.reduce((obj, symbol) => {
      obj[symbol.frame] = symbol.data
      return obj
    }, {})
    callback(null, `const icons=${JSON.stringify(result)};exports.icon=(frame,color=null)=>\`data:image/svg+xml;base64,\${Buffer.from(color?icons[frame].replace(/"black"/g,\`"\${color}"\`):icons[frame]).toString('base64')}\`;exports.icons=icons;`)
  }
}

module.exports.raw = true
