const { resolve } = require('path')

const root = resolve(__dirname)

module.exports = {
  entry: [`${root}/index.js`],
  output: { path: root, filename: 'bundle.js' },
  devtool: 'inline-source-map',
  devServer: { contentBase: root, inline: true },
  module: {
    rules: [{
      test: /\.(figma)/,
      use: [{
        loader: `${root}/../index`,
        options: { accessToken: '00000-00000000-0000-0000-0000-000000000000', encoding: 'base64' }
      }]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  }
}
