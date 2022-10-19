import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 定义一些路由
// 每个路由都需要映射到一个组件
const routes:Array<RouteRecordRaw> = [
    {
        path: "/",
        component: () => import('../views/system/menu.vue')
    },
    {
        path: "/arcgismap",
        component: () => import('../views/arcgis/DisplayAMap.vue')
    },
    {
        path: "/olmap",
        component: () => import('../views/openlayers/baseMap.vue')
    },{
        path: "/colormap",
        component: () => import('../views/openlayers/colorMap.vue')
    },{
        path: "/weathermap",
        component: () => import('../views/openlayers/weatherMap.vue')
    },{
        path: "/adsorbeditor",
        component: () => import('../views/openlayers/adsorbEditor.vue')
    }
]

// 创建路由实例并传递`routes`配置
const router = createRouter({
    history: createWebHashHistory(),  // 改为hash模式，在nginx部署时正常访问路由
    routes
})

export default router