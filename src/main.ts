/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2022-10-23 17:44:09
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-05-29 17:42:00
 * @FilePath: \GisShow\src\main.ts
 * @Description: 
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@arcgis/core/assets/esri/themes/dark/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
  .mount('#app')
