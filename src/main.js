import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource-variable/lora/wght-italic.css'
import './assets/styles/main.scss'

const app = createApp(App).use(createPinia()).use(router)
router.isReady().then(() => app.mount('#app'))
