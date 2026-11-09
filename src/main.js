import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import './assets/styles/main.scss'

const app = createApp(App).use(createPinia()).use(router)
router.isReady().then(() => app.mount('#app'))
