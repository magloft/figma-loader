## figma-loader

Figma to SVG URL loader module for webpack.

## Install

`yarn add --dev figma-loader`

`npm install --save-dev figma-loader`

### Webpack Configuration

```js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.(figma)/,
      use: [{
        loader: 'figma-loader',
        options: { accessToken: 'FIGMA-PERSONAL-ACCESS-TOKEN', encoding: 'base64' /* or 'raw' */ }
      }]
    }]
  }
}
```

## Figma Document Setup

1. Create a Figma document with frames on the top level of a page.
2. Assets are extracted by page name and frame name.
3. For each Figma document used in your project, create a `*.figma` file containing the Figma File ID, e.g. `eMV7Sxpjs7y6HhnQyC0roR`

Here's an example of a figma document layout:

```
document 'icons'
  page 'symbols'
    frame 'star'
    frame 'fish'
  page 'social'
    frame 'facebook'
    frame 'twitter'
```

## Example usage in CSS
```css
.icon-star { background-image: url(./icons.figma?page=symbols&frame=star); }
.icon-fish { background-image: url(./icons.figma?page=symbols&frame=fish); }
.icon-facebook { background-image: url(./icons.figma?page=social&frame=facebook); }
.icon-twitter { background-image: url(./icons.figma?page=social&frame=twitter); }
```

## Example usage in JS
```js
const icons = require('./icons.figma')

{
  symbols: {
    star: "<svg>...</svg>",
    fish: "<svg>...</svg>"
  },
  social: {
    twitter: star: "<svg>...</svg>",
    facebook: star: "<svg>...</svg>"
  }
}
```
