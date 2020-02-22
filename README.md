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
        options: { accessToken: 'FIGMA-PERSONAL-ACCESS-TOKEN' }
      }]
    }]
  }
}
```

## Figma Document Setup

1. Create a Figma document with frames on the top level of a page.
2. Assets are extracted by frame name.
3. For each Figma document used in your project, create a `*.figma` file containing the Figma File ID, e.g. `eMV7Sxpjs7y6HhnQyC0roR`

Here's an example of a figma document layout:

```
document 'icons'
  page 'Page 1'
    frame 'star'
    frame 'fish'
    frame 'facebook'
    frame 'twitter'
```

## Example usage in CSS

You can use the relative url to your figma document. Query parameter `frame` specified the target frame, and optional `color` tints the image.

```css
.icon-star { background-image: url(./icons.figma?frame=star); }
.icon-fish { background-image: url(./icons.figma?frame=fish); }
.icon-facebook { background-image: url(./icons.figma?frame=facebook); }
.icon-twitter { background-image: url(./icons.figma?frame=twitter&color=FF0000); }
```

## Example usage in JS

Import the 'icon' function, which generates a base64-encoded data-uri.

```js
// require your figma document
const { icon } = require('./icons.figma')

// generate star icon
const starIcon = icon('star')

// generate red star icon, by replacing 'black' color to '#FF0000'
const starIconRed = icon('star', '#FF0000')
```
