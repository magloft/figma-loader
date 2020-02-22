const { tmpdir } = require('os')
const { existsSync, readFileSync, writeFileSync, mkdirpSync } = require('fs-extra')
const loaderUtils = require('loader-utils')
const findCacheDir = require('find-cache-dir')
const Figma = require('figma-js')
const axios = require('axios')

const CACHE_DIR = findCacheDir({ name: 'figma-svg-json-loader' }) || tmpdir()
if (!existsSync(CACHE_DIR)) { mkdirpSync(CACHE_DIR) }

async function getSymbols({ fileId, accessToken, cache }) {
  const jsonPath = `${CACHE_DIR}/${fileId}.json`
  if (cache && existsSync(jsonPath)) { return JSON.parse(readFileSync(jsonPath, 'utf8')) }
  const client = Figma.Client({ personalAccessToken: accessToken })
  const { document } = (await client.file(fileId)).data
  const pages = document.children
  const symbols = pages.reduce((arr, page) => {
    for (const { id, name } of page.children) {
      arr.push({ id, page: page.name, frame: name })
    }
    return arr
  }, [])
  const ids = symbols.map(({ id }) => id)
  const { images } = (await client.fileImages(fileId, { ids, format: 'svg' })).data
  await Promise.all(symbols.map(async(symbol) => {
    const url = images[symbol.id]
    const response = await axios.get(url)
    symbol.data = response.data
  }))
  writeFileSync(jsonPath, JSON.stringify(symbols), 'utf8')
  return symbols
}

function encodeSvg(data, encoding = 'raw') {
  if (encoding !== 'base64') { return data }
  return `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`
}

module.exports = async function(fileId) {
  const query = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : {}
  const { cache } = this._compiler.options
  const options = { cache, fileId, ...loaderUtils.getOptions(this), ...query }
  if (this.cacheable) { this.cacheable(true) }
  const callback = this.async()
  this.addDependency(this.resourcePath)
  this.addDependency(CACHE_DIR)
  const symbols = await getSymbols(options)
  if (options.page && options.frame) {
    const symbol = symbols.find(({ page, frame }) => options.page === page && options.frame === frame)
    callback(null, `module.exports = ${JSON.stringify(encodeSvg(symbol.data, options.encoding))}`)
  } else {
    const result = symbols.reduce((obj, symbol) => {
      if (!obj[symbol.page]) { obj[symbol.page] = {} }
      obj[symbol.page][symbol.frame] = encodeSvg(symbol.data, options.encoding)
      return obj
    }, {})
    callback(null, `module.exports = ${JSON.stringify(result)}`)
  }
}

module.exports.raw = true
