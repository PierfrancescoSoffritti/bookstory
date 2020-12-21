function shareImage(canvas, shareNotSupported, error, name) {
  gtag('event', 'share', {
    'item_id': name
  });

  canvas.toBlob(blob => {
    const file = new File([blob], `${name}.jpg`, {type: blob.type});
    if (navigator.canShare && navigator.canShare({ files: [ file ] })) {
      navigator.share({
        files: [ file ],
        title: name,
        text: name,
      })
      .then(() => console.log('Share was successful.'))
      .catch(() => error())
    } else {
      shareNotSupported()
    }
  }, 'image/jpeg', 1)
}

function startLoading() {
  document.getElementById("loading-root").style.visibility = "visible"
}

function stopLoading() {
  document.getElementById("loading-root").style.visibility = "hidden"
}

function showSnackbar(message) {
  snackbar.className = "show"
  snackbar.innerText = message

  setTimeout(() => { snackbar.className = snackbar.className.replace("show", ""); }, 3000)
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
  
function findMax(values) {
  let max = Number.MIN_VALUE
  for(let i=0; i<values.length; i++) {
    if(values[i] > max) {
      max = values[i]
    }
  }
  return max
}
  
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}