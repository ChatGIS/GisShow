import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@arcgis/core/assets/esri/themes/dark/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
    .mount('#app')
