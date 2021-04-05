<template>
  <div class="container">
    <flip-text
      :msg="text"
      :key="key"
      :width="width"
      :height="height"
      :tile-size="parseInt(tileSize)"
      :max-delay="maxDelay"
      :show-grid="showGrid"
      :max-depth="maxDepth"
    />
  </div>
  <h4>Props</h4>
  <div>
    <label>
      Text
      <input type="text" v-model="text" />
    </label>
    <label>
      Tile size
      <input type="number" v-model="tileSize" />
    </label>
    <label>
      Width
      <input type="number" v-model="width" />
    </label>
    <label>
      Height
      <input type="number" v-model="height" />
    </label>
    <label>
      Max delay
      <input type="number" v-model="maxDelay" />
    </label>
    <label>
      Max depth (splits)
      <input type="number" v-model="maxDepth" />
    </label>
    <label>
      Split threshold
      <input type="number" v-model="splitThreshold" />
    </label>
    <label>
      Flip duration
      <input type="number" v-model="flipDuration" />
    </label>
    <label>
      Show grid
      <input type="checkbox" v-model="showGrid" />
    </label>
    <button @click="key = Math.random()">Run</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Hey Yo :)')
const tileSize = ref(40)
const key = ref(1)
const maxDelay = ref(2000)
const maxDepth = ref(0)
const width = ref(1000)
const height = ref(200)
const splitThreshold = ref(150)
const flipDuration = ref(700)
const showGrid = ref(false)

</script>

<style scoped lang="scss">
.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
label {
  display: block;;
}
</style>