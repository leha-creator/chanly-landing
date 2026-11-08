import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import './assets/styles/main.scss'

createApp(App).use(createPinia()).use(router).mount('#app')
