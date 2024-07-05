/*
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2024-05-15 22:40:22
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-18 10:55:52
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
