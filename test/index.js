require('./index.css')
const { icon } = require('./icons.figma')

async function main() {
  for (let i=0; i<255; i+=8) {
    const img = document.createElement('img')
    img.src = icon('star', `rgba(${i},170,${255-i},1.0)`)
    document.querySelector('.images').appendChild(img)
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}

main()
