import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import FlipText from './components/FlipText.vue'

app.component('flip-text', FlipText)

app.mount('#app')
