<template>
  <div id="root" ref="root">
    <div id="tiles" :class="showGrid && 'showGrid'" ref="tilesElem" />
    <canvas
      ref="canvasElem"
      id="canvas"
      :width="width * 2"
      :height="height * 2"
    ></canvas>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'

const {
  msg,
  width,
  height,
  tileSize,
  maxDelay,
  maxDepth,
  splitThreshold = 150,
  flipDuration = 700,
} = defineProps({
  msg: String,
  width: Number,
  height: Number,
  tileSize: Number,
  maxDelay: Number,
  showGrid: Boolean,
  maxDepth: Number,
  splitThreshold: Number,
  flipDuration: Number,
})

const root = ref(null)
const tilesElem = ref(null)
const canvasElem = ref(null)
const canvasElemCtx = ref(null)
const tiles = ref([])

const getBase64Data = (imageData, tileCanvas, tileCanvasCtx) => {
  tileCanvasCtx.putImageData(imageData, 0, 0);
  return tileCanvas.toDataURL()
}

const getImageColor = imageData => {
  let color = 0
  for (let i = 0; i < imageData.data.length; i++) {
    color += imageData.data[i]
  }
  return color * 4 / imageData.data.length
}

// Recursively draw a tile grid
const drawTileGrid = (startX, startY, maxX, maxY, tileSize, depth) => {
  console.log(startX, startY, maxX, maxY, tileSize, depth)
  const tiles = []

  // Temp canvas to copy part of orginal canvas as base64 image.
  const tileCanvas = document.createElement('canvas')
  tileCanvas.width = tileSize
  tileCanvas.height = tileSize
  const tileCanvasCtx = tileCanvas.getContext('2d')

  // Copy tiles from canvas
  var ctx = canvasElemCtx.value
  for (let y = startY; y < maxY; y += tileSize) {
    for (let x = startX; x < maxX; x += tileSize) {
      // Copy part of canvas for a tile
      const imageData = ctx.getImageData(
        x,
        y,
        tileSize,
        tileSize
      )
      const imageColor = getImageColor(imageData)
      if (imageColor === 0) {
        // Full white grid tiles are not rendered
      } else if (imageColor > splitThreshold || depth >= maxDepth) {
        // Full black grid tiles
        const tile = document.createElement('img')
        tile.style.top = `${y}px`
        tile.style.left = `${x}px`
        tile.style.width = `${tileSize}px`
        tile.style.height = `${tileSize}px`
        tile.style.transitionDuration = `${flipDuration}ms`
        tile.src = getBase64Data(imageData, tileCanvas, tileCanvasCtx)
        tiles.push(tile)
        tilesElem.value.appendChild(tile)

        // Start, time, and randomize animations
        setTimeout(() => {
          tile.classList.add('opening')
          setTimeout(() => {
            tile.classList.add('open')
          }, flipDuration)
        }, Math.floor(Math.random() * maxDelay))

      } else {
        tiles.value = drawTileGrid(
          x,
          y,
          x + tileSize,
          y + tileSize,
          tileSize / 2,
          depth + 1
        )
      }
    }
  }
}

onMounted(() => {
  // Set 2x pixel density
  root.value.style.width = `${width}px`
  root.value.style.height = `${height}px`

  canvasElemCtx.value = canvasElem.value.getContext('2d')

  // Draw text to canvas
  var ctx = canvasElemCtx.value
  ctx.font = `900 ${height * 2}px/${height * 2}px Avenir, Helvetica, Arial, sans-serif`
  ctx.textBaseline = 'top'
  ctx.fillText(msg, 0, 0)

  tiles.value = drawTileGrid(
    0,
    0,
    Math.floor(width * 2),
    Math.floor(height * 2),
    tileSize,
    0
  )
})

</script>

<style lang="scss">
#root {
  position: relative;
  display: inline-block;
  transform: scale(50%);
  transform-origin: top left;
  // font: bold 100px Avenir, Helvetica, Arial, sans-serif;
}
canvas {
  display: block;
  border: 1px solid grey;
  visibility: hidden;
}
#tiles {
  position: absolute;
  width: 100%;
  height: 100%;

  & > * {
    position: absolute;
    display: block;
    background-color: white;
    object-fit: cover;
    transform-origin: top center;
    transform: rotateX(90deg);
    box-shadow: 0px 100px 90px 0px rgba(22, 31, 39, 0.42);

    // EaseOutExpo
    transition:
      1.0s cubic-bezier(0.16, 1, 0.3, 1) transform,
      1.0s cubic-bezier(0.16, 1, 0.3, 1) box-shadow;

    // EaseInOutExpo
    // transition:
    //   transform 1.0s cubic-bezier(0.87, 0, 0.13, 1),
    //   box-shadow 0.5s cubic-bezier(0.87, 0, 0.13, 1);

    &.opening {
      transform: rotateX(0deg);
      box-shadow: 0px 20px 40px 0px rgba(22, 31, 39, 0.32);
    }

    &.open {
      transition: 250ms ease-in box-shadow;
      box-shadow: 0px 0px 0px 0px rgba(22, 31, 39, 0);
    }
  }

  &.showGrid > * {
    border: 1px solid red;
  }
}

</style>