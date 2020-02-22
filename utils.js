const findCacheDir = require('find-cache-dir')
const Figma = require('figma-js')
const axios = require('axios')
const { existsSync, readFileSync, writeFileSync, mkdirpSync } = require('fs-extra')
const { tmpdir } = require('os')

exports.CACHE_DIR = findCacheDir({ name: 'figma-loader' }) || tmpdir()
if (!existsSync(exports.CACHE_DIR)) { mkdirpSync(exports.CACHE_DIR) }

exports.getSymbols = async function({ fileId, accessToken, cache }) {
  const jsonPath = `${exports.CACHE_DIR}/${fileId}.json`
  if (cache && existsSync(jsonPath)) { return JSON.parse(readFileSync(jsonPath, 'utf8')) }
  const client = Figma.Client({ personalAccessToken: accessToken })
  const { document } = (await client.file(fileId)).data
  const symbols = document.children.reduce((arr, page) => {
    for (const { id, name } of page.children) {
      arr.push({ id, frame: name })
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

exports.encodeSvg = function(data, color = null) {
  const svg = color ? data.replace(/"black"/g, `"#${color}"`) : data
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
