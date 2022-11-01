import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 定义一些路由
// 每个路由都需要映射到一个组件
const routes:Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/system/BaseMenu.vue')
    },{
        path: '/arcgismap',
        component: () => import('@/views/arcgis/DisplayAMap.vue')
    },{
        path: '/map-base',
        component: () => import('@/views/openlayers/MapBase.vue')
    },{
        path: '/map-color',
        component: () => import('@/views/openlayers/MapColor.vue')
    },{
        path: '/map-weather',
        component: () => import('@/views/openlayers/MapWeather.vue')
    },{
        path: '/draw-trace',
        component: () => import('@/views/openlayers/DrawTrace.vue')
    },{
        path: '/data-type',
        component: () => import('@/views/openlayers/DataType.vue')
    },{
        path: '/hello-cesium',
        component: () => import('@/views/cesium/HelloCesium.vue')
    }
]

// 创建路由实例并传递`routes`配置
const router = createRouter({
    history: createWebHashHistory(),  // 改为hash模式，在nginx部署时正常访问路由
    routes
})

export default router