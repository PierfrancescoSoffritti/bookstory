const canvas = document.getElementById("canvas")
canvas.width = canvasWidth
canvas.height = canvasHeight
const context = canvas.getContext("2d")

const images = []
const removeLastImageButton = document.getElementById("remove-last-image")
const snackbar = document.getElementById("snackbar");

const inputField = document.getElementById("input-field")
const addImageButton = document.getElementById("add-image")
const shareButton = document.getElementById("share-button")
const downloadButton = document.getElementById("download-button")

addImageButton.disabled = true
removeLastImageButton.disabled = true

smartRender()

inputField.oninput = () => {
  const text = inputField.value
  addImageButton.disabled = text.length <= 0
}

inputField.onchange = () => {
  addImageButton.click()
}

addImageButton.onclick = () => {
  const text = inputField.value
  
  startLoading()

  fetch(`/logs/?q=${text}`)
  .then(response => response.json())
  .then(json => { 
    const url = json.coverUrl
    if (url == "") {
      stopLoading()
      showSnackbar("Book not found - try to be more specific")
    } else {
      loadImage(url, () => { 
        stopLoading() 
        smartRender()
        
        inputField.focus()
      })
    }
  })
  .catch(() => { 
    stopLoading() 
    showSnackbar("Book not found - try to be more specific")
  })
}

shareButton.onclick = () => {
  shareImage(canvas, () => showSnackbar("Share not supported on your device - download instead"), () => showSnackbar("Image not shared"), 'Year in books')
}

downloadButton.onclick = () => {
  const downloadUrl = canvas.toDataURL('image/jpeg', 1.0)
  downloadButton.href = downloadUrl
}

// const staticBooks = ["https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1578216397l/31920777._SY475_.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1349044077l/127932.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1447047702l/63697.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348972089l/9278897.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1424410383l/236765.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1549433350l/40672036._SY475_.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1479719623l/30962055.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1350363456l/15811497.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1402600211l/69242.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1495791951l/31451193.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348303426l/43150.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1383718290l/13079982.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1352422827l/13530973.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1430864612l/681941.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1360239609l/62793.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1347802026l/62812.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1330431707l/62802.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1342749212l/62796.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1554279400l/42118073.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1502518360l/35074096._SY475_.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1496699608l/22155._SX318_.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1377221024l/18367394.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388355908l/62804.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1544498456l/41677385.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327629352l/162332.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1384259565l/91781.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1531295292l/2213661.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1500809335l/32895535._SX318_.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1379873824l/13186972.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1344265017l/10256723.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1442460745l/840._SY475_.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1375947566l/5128.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1404513286l/52090.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1529041799l/40242274.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1426255855l/24727079.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1421619214l/97411.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553896240l/703._SY475_.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327649258l/50695.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348339374l/28920.jpg", "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1594130599l/43945._SY475_.jpg"]
// for (let i=0; i<staticBooks.length; i++) {
//   const randomBook = staticBooks[i]
//   loadImage(randomBook, () => { 
//     smartRender()
//   })
// }

removeLastImageButton.onclick = () => {
  images.pop()

  removeLastImageButton.disabled = images.length <= 0

  smartRender()
}

function smartRender() {
  render(context, { 
    x: leftRightMargin + innerMargin, 
    y: topBottomMargin + innerMargin, 
    w: canvas.width - (leftRightMargin*2) - (innerMargin*2), 
    h: canvas.height - (topBottomMargin*2) - (innerMargin*2) - textStripHeight
  },
  images,
  0.01
  )
}

function loadImage(url, callback) {
  const image = new Image
  image.crossOrigin = 'anonymous'
  image.onload = function() {
    images.push(image)

    removeLastImageButton.disabled = false
    callback()
  }
  image.src = url
}

function render(context, region, images, blockScale) {
  drawBackground(context)
  drawMainRectangle(context)
  drawText(context, "YEAR IN BOOKS")

  if (images.length == 0) {
    return
  }
  
  const biggestImageWidth = findMax(images.map(image => image.width))
  const biggestImageHeight = findMax(images.map(image => image.height))
  
  let blockWidth, blockHeight, layoutData
  
  while(true) {
    const tBlockScale = blockScale + 0.001
    const tBlockWidth = biggestImageWidth * tBlockScale
    const tBlockHeight = biggestImageHeight * tBlockScale
    const tLayoutData = layout(region, images.length, tBlockWidth, tBlockHeight)

    if(tLayoutData.emptySpaceHeight >= 0 && tLayoutData.emptySpaceWidth >= 0) {
      blockScale = tBlockScale
      blockWidth = tBlockWidth
      blockHeight = tBlockHeight
      layoutData = tLayoutData
    } else {
      break
    }
  }

  const wInc = layoutData.emptySpaceWidth / layoutData.cols
  const hInc = layoutData.emptySpaceHeight / layoutData.rows
      
  let x = region.x, y = region.y
  
  for (let i=0; i<images.length; i++) {
    const image = images[i]
    
    const scale = getScaleToFit(image, blockWidth, blockHeight)
    const imageWidth = (image.width * scale) - 15
    const imageHeight = (image.height * scale) - 10
    
    if (x + blockWidth > region.x + region.w) {
      x = region.x
      y += blockHeight + hInc
    }
    
    // context.fillStyle = `rgba(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${0.5})`
    // context.fillRect(x, y, blockWidth + wInc, blockHeight + hInc)
    
    const xOffset = blockWidth - imageWidth
    const yOffset = blockHeight - imageHeight
    context.drawImage(image, x + xOffset/2 + wInc/2, y + yOffset/2 + hInc/2, imageWidth, imageHeight) 
    
    x += blockWidth + wInc
  }
}

// do a layout pass to figure out number of rows and cols, and remaining empty space
function layout(region, blockCount, blockWidth, blockHeight) {
  let emptySpaceWidth = 0
  let emptySpaceHeight = 0
  let cols = 0, tCols = 0
  let rows = 0
  
  let x = 0, y = 0
  for (let i=0; i<blockCount; i++) {    
    if (x + blockWidth > region.w) {
      rows += 1
      cols = tCols
      tCols = 0
      
      emptySpaceWidth = region.w - x
      
      x = 0
      y += blockHeight
    }
    
    tCols += 1
    x += blockWidth
  }
  
  rows += 1
  y += blockHeight
  
  emptySpaceHeight = region.h - y
  
  if (cols == 0) {
    cols = tCols
    emptySpaceWidth = region.w - x
  }
  
  return { rows, cols, emptySpaceWidth, emptySpaceHeight }
}