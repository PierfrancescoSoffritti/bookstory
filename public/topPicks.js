const canvas = document.getElementById("canvas")
canvas.width = canvasWidth
canvas.height = canvasHeight
const context = canvas.getContext("2d")

let image, author = "", title = ""

const downloadButton = document.getElementById("download-button")
const shareButton = document.getElementById("share-button")
const bookInput = document.getElementById("book-input-field")
const addBookButton = document.getElementById("add-image")
const quoteInput = document.getElementById("quote-input-field")

addBookButton.disabled = true

// rendering
const leftRightGradientMargin = 85
const topBottomGradientMargin = 165

const gradientRectangleHeight = 665
const gradientRectangleWidth = canvas.width - (leftRightMargin + leftRightGradientMargin)*2

const gradientRectangleRightX = canvas.width - (leftRightMargin + leftRightGradientMargin)*2
const gradientRectangleTopY = topBottomMargin + topBottomGradientMargin
const gradientRectangleBottomY = gradientRectangleTopY + gradientRectangleHeight

const imageBlockWidth = gradientRectangleWidth/1.2
const imageBlockHeight = gradientRectangleHeight*1.2

const titleBlock = {
  x: leftRightMargin + innerMargin,
  y: NaN,
  width: canvas.width - leftRightMargin*2 - innerMargin*2,
  height: NaN
}

const textBlock = {
  x: leftRightMargin + innerMargin,
  y: NaN,
  width: canvas.width - leftRightMargin*2 - innerMargin*2,
  height: NaN
}

const ratingTitleBlock = {
  x: leftRightMargin + innerMargin,
  y: NaN,
  width: canvas.width - leftRightMargin*2 - innerMargin*2,
  height: NaN
}

const ratingBodyBlock = {
  x: leftRightMargin + innerMargin,
  y: NaN,
  width: canvas.width - leftRightMargin*2 - innerMargin*2,
  height: NaN
}

smartRender()

shareButton.onclick = () => {
  shareImage(canvas, () => showSnackbar("Share not supported on your device - download instead"), () => showSnackbar("Image not shared"), 'Year in books - top pick')
}

addBookButton.onclick = () => {
  const query = bookInput.value
  
  startLoading()

  fetch(`/logs/?q=${query}`)
  .then(response => response.json())
  .then(json => { 
    const url = json.coverUrl
    if (url == "") {
      stopLoading()
      showSnackbar("Book not found")
    } else {
      loadImage(url, img => {
        image = img
        title = json.title
        author = json.author
        stopLoading()
        smartRender()
      })
    }
  })
  .catch(() => { 
    stopLoading() 
    showSnackbar("Book not found")
  })
}

function smartRender() {
  render(context, image, title, author, quoteInput.value)
}

bookInput.oninput = () => {
  const text = bookInput.value
  addBookButton.disabled = text.length <= 0

  smartRender()
}

bookInput.onchange = () => {
  addBookButton.click()
}

quoteInput.oninput = () => {
  smartRender()
}

downloadButton.onclick = () => {
  const downloadUrl = canvas.toDataURL('image/jpeg', 1.0)
  downloadButton.href = downloadUrl
}

function loadImage(url, callback) {
  const img = new Image
  img.crossOrigin = 'anonymous'
  img.onload = function() {
    callback(img)
  }
  img.src = url
}

function render(context, image, title, author, text) {
  context.clearRect(0, 0, canvas.width, canvas.height)

  drawBackground(context)
  drawMainRectangle(context)
  drawText(context, "YEAR IN BOOKS - TOP PICKS")
  drawGradientRectangle(context)

  renderImage(context, image)

  let titleFontSize = 50
  let titleLineHeight = 55

  let textFontSize = 45
  let textLineHeight = 55

  let ratingBodyFontSize = 90
  let ratingBodyLineHeight = 150

  const titleRenderingData = getRenderingData(context, title, titleBlock, titleFontSize, titleLineHeight)
  renderText(context, titleRenderingData.lines, titleRenderingData.fontSize, titleRenderingData.lineHeight, titleBlock, "#FFFFFF")

  const textRenderingData = getRenderingData(context, text, textBlock, textFontSize, textLineHeight)
  renderText(context, textRenderingData.lines, textRenderingData.fontSize, textRenderingData.lineHeight, textBlock, "#CDF564")

  const ratingTitleRenderingData = getRenderingData(context, "AUTHOR", ratingTitleBlock, titleFontSize, titleLineHeight)
  renderText(context, ratingTitleRenderingData.lines, ratingTitleRenderingData.fontSize, ratingTitleRenderingData.lineHeight, ratingTitleBlock, "#FFFFFF")

  const ratingBodyRenderingData = getRenderingData(context, author, ratingBodyBlock, ratingBodyFontSize, ratingBodyLineHeight)
  renderText(context, ratingBodyRenderingData.lines, ratingBodyRenderingData.fontSize, ratingBodyRenderingData.lineHeight, ratingBodyBlock, "#CDF564")
}

function getRenderingData(context, text, block, fontSize, lineHeight) {
  let lines = splitTextIntoLines(text, context, block.width, fontSize)
  let layoutData = layout(lines, lineHeight, block)
  while (layoutData.emptySpaceHeight < 0) {
    fontSize -= 1
    lineHeight -= 1

    lines = splitTextIntoLines(text, context, block.width, fontSize)
    layoutData = layout(lines, lineHeight, block)
  }

  return { fontSize, lineHeight, lines }
}

function layout(lines, lineHeight, block) {
  const textHeight = lines.length * lineHeight
  emptySpaceHeight = block.height - textHeight
  return { emptySpaceHeight }
}

function renderText(context, lines, fontSize, lineHeight, block, color) {
  context.font = `bold ${fontSize}px 'Cabin', sans-serif`
  context.textBaseline = 'top'

  const textHeight = lines.length * lineHeight

  // text block
  // context.fillStyle = `rgba(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${0.5})`
  // context.fillRect(
  //   block.x,
  //   block.y,
  //   block.width,
  //   block.height
  // )
  
  let y = block.y

  context.fillStyle = color

  lines.forEach( line => {
    context.fillText(line.join(" "), block.x, y)
    y += lineHeight
  })
}

function renderImage(context, image) {
  if (!image) {
    titleBlock.y = gradientRectangleBottomY + 75
    titleBlock.height = 100

    textBlock.y = titleBlock.y + titleBlock.height
    textBlock.height = 500
    return
  }

  const scale = getScaleToFit(image, imageBlockWidth, imageBlockHeight)

  const imageWidht = image.width * scale
  const imageHeight = image.height * scale

  titleBlock.y = Math.max(gradientRectangleBottomY, (imageHeight - gradientRectangleHeight)/2 + gradientRectangleBottomY) + 75
  titleBlock.height = 100

  textBlock.y = titleBlock.y + titleBlock.height
  textBlock.height =  500

  ratingTitleBlock.y = textBlock.y + textBlock.height
  ratingTitleBlock.height = 100

  ratingBodyBlock.y = ratingTitleBlock.y + ratingTitleBlock.height
  ratingBodyBlock.height = canvas.height - topBottomMargin - textStripHeight - (ratingTitleBlock.y + ratingTitleBlock.height) - innerMargin

  // image block
  // context.fillStyle = `rgba(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${0.5})`
  // context.fillRect(
  //   leftRightMargin + leftRightGradientMargin + gradientRectangleWidth/2 - imageBlockWidth/2,
  //   topBottomMargin + topBottomGradientMargin + gradientRectangleHeight/2 - imageBlockHeight/2,
  //   imageBlockWidth,
  //   imageBlockHeight
  // )

  context.drawImage(
    image,
    leftRightMargin + leftRightGradientMargin + gradientRectangleWidth/2 - imageWidht/2,
    topBottomMargin + topBottomGradientMargin + gradientRectangleHeight/2 - imageHeight/2,
    imageWidht,
    imageHeight
  )
}

function splitTextIntoLines(txt, context, blockWidth, fontSize) {
  context.font = `bold ${fontSize}px 'Cabin', sans-serif`

  const lines = [ txt.split(" ") ]
  let i = 0
  while (i < lines.length) {
    let line = lines[i]
    let lineWidth = context.measureText(line.join(" ")).width
   
    while (lineWidth > blockWidth && line.length > 1) {
      const removed = line.pop()
  
      if (i+1 == lines.length) {
        lines.push( [ removed ] )
      } else {
        const nextLine = lines[i+1]
        nextLine.unshift(removed)
      }

      lineWidth = context.measureText(line.join(" ")).width
    }
    i += 1
  }
  return lines
}

function drawGradientRectangle(context) {
  const gradient = context.createLinearGradient(gradientRectangleRightX, gradientRectangleTopY, gradientRectangleRightX, gradientRectangleTopY + gradientRectangleHeight);
  gradient.addColorStop(0, '#C1ECC8')
  gradient.addColorStop(1 / 5, '#F8E52F')
  gradient.addColorStop(2 / 5, 'red')
  gradient.addColorStop(3 / 5, '#020000')
  gradient.addColorStop(4 / 5, '#4101F4')
  gradient.addColorStop(1, '#C1ECC8')

  context.fillStyle = gradient
  context.fillRect(leftRightMargin + leftRightGradientMargin, topBottomMargin + topBottomGradientMargin, canvas.width - (leftRightMargin + leftRightGradientMargin)*2, gradientRectangleHeight)
}