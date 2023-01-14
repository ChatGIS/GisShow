import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 定义一些路由
// 每个路由都需要映射到一个组件
const routes:Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/views/system/BaseMenu.vue')
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
    },{
        path: '/map-rectification',
        component: () => import('@/views/openlayers/MapRectification.vue')
    },{
        path: '/measure-tool',
        component: () => import('@/views/openlayers/MeasureTool.vue')
    },{
        path: '/map-swipe',
        component: () => import('@/views/openlayers/MapSwipe.vue')
    },{
        path: '/map-online',
        component: () => import('@/views/openlayers/MapOnline.vue')
    },{
        path: '/hello-canvas',
        component: () => import('@/views/openlayers/HelloCanvas.vue')
    },{
        path: '/geo-code',
        component: () => import('@/views/openlayers/GeoCode.vue')
    },{
        path: '/employee-show',
        component: () => import('@/views/openlayers/EmployeeShow.vue')
    },{
        path: '/hello-leaflet',
        component: () => import('@/views/leaflet/HelloLeaflet.vue')
    },{
        path: '/leaflet-migration',
        component: () => import('@/views/leaflet/MigrationEcharts.vue')
    }
]

// 创建路由实例并传递`routes`配置
const router = createRouter({
    history: createWebHashHistory(),  // 改为hash模式，在nginx部署时正常访问路由
    routes
})

export default router