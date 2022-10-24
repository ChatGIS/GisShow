import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@arcgis/core/assets/esri/themes/dark/main.css'

createApp(App)
    .use(router)
    .mount('#app')
