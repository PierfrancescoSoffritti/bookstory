const canvasWidth = 1440
const canvasHeight = 2560

const leftRightMargin = 140
const topBottomMargin = 245
const textStripHeight = 160
const innerMargin = 60

const mainRectangleHeight = canvas.height - topBottomMargin*2
const mainRectangleWidth = canvas.width - leftRightMargin*2

function drawText(context, text) {
  context.font = "bold 40px 'Roboto', sans-serif"
  context.fillStyle = "#4100F5"
  context.textBaseline = 'middle'
  context.fillText(text, leftRightMargin + innerMargin, canvas.height - topBottomMargin - textStripHeight / 2)

  const url = "BOOKSTORY.ME"
  const urlWidth = context.measureText(url).width
  context.fillText(url, canvas.width - leftRightMargin - urlWidth - innerMargin, canvas.height - topBottomMargin - textStripHeight / 2)
}

function drawBackground(context) {
  const gradient = context.createLinearGradient(canvas.width, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#4101F4')
  gradient.addColorStop(1 / 4, '#C1ECC8')
  gradient.addColorStop(2.2 / 4, '#F8E52F')
  gradient.addColorStop(3 / 4, 'red')
  gradient.addColorStop(1, '#020000')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)
}

function drawMainRectangle(context) {
  context.fillStyle = "#4100F5"

  roundRect(
    context,
    leftRightMargin,
    topBottomMargin,
    canvas.width-leftRightMargin*2,
    canvas.height-topBottomMargin*2,
    15,
    true,
    false,
    true
  )
  
  context.fillStyle = "#CDF564"

  roundRect(
    context,
    leftRightMargin,
    canvas.height-topBottomMargin - textStripHeight,
    canvas.width-leftRightMargin*2,
    textStripHeight,
    15,
    true,
    false,
    false
  )
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke, roundTop) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  
  if (roundTop) {
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  } else {
    ctx.lineTo(x + width, y);
  }

  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);

  if (roundTop) {
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  } else {
    ctx.lineTo(x, y);
  }

  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

// return a number by which the image can be scaled to fit inside the maxWidth x maxHeight rectangle
function getScaleToFit(image, maxWidth, maxHeight) {
  const scaleW = maxWidth / image.width
  const scaleH = maxHeight / image.height

  // scale by w
  if (image.height * scaleW <= maxHeight) {
    return scaleW
  } else if (image.width * scaleH <= maxWidth) {
    return scaleH
  } else {
    console.error("can't scale")
  }
}