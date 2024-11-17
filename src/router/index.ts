import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 定义一些路由
// 每个路由都需要映射到一个组件
const routes:Array<RouteRecordRaw> = [
  {
    name: 'BaseMenu',
    path: '/',
    component: () => import('@/views/system/BaseMenu.vue'),
    meta: {
      keepAlive: true
    }
  },{
    name: 'DisplayAMap',
    path: '/arcgismap',
    component: () => import('@/views/arcgis/DisplayAMap.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'MapBase',
    path: '/map-base',
    component: () => import('@/views/openlayers/MapBase.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'MapColor',
    path: '/map-color',
    component: () => import('@/views/openlayers/MapColor.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'MapWeather',
    path: '/map-weather',
    component: () => import('@/views/openlayers/MapWeather.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'DrawTrace',
    path: '/draw-trace',
    component: () => import('@/views/openlayers/DrawTrace.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'DataType',
    path: '/data-type',
    component: () => import('@/views/openlayers/DataType.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'MapRectification',
    path: '/map-rectification',
    component: () => import('@/views/openlayers/MapRectification.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'MeasureTool',
    path: '/measure-tool',
    component: () => import('@/views/openlayers/MeasureTool.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'MapSwipe',
    path: '/map-swipe',
    component: () => import('@/views/openlayers/MapSwipe.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'SwipeVertical',
    path: '/swipe-vertical',
    component: () => import('@/views/openlayers/SwipeVertical.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'MapOnline',
    path: '/map-online',
    component: () => import('@/views/openlayers/MapOnline.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'HelloCanvas',
    path: '/hello-canvas',
    component: () => import('@/views/openlayers/HelloCanvas.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'GeoCode',
    path: '/geo-code',
    component: () => import('@/views/openlayers/GeoCode.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'EmployeeShow',
    path: '/employee-show',
    component: () => import('@/views/openlayers/EmployeeShow.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'HelloLeaflet',
    path: '/hello-leaflet',
    component: () => import('@/views/leaflet/HelloLeaflet.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'FlyLine',
    path: '/antv-l7-flyline',
    component: () => import('@/views/antvl7/FlyLine.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'MultiScreenLinkage',
    path: '/multi-screen-linkage',
    component: () => import('@/views/openlayers/MultiScreenLinkage.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'FeatureStyle',
    path: '/feature-style',
    component: () => import('@/views/openlayers/FeatureStyle.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'StyleRipple',
    path: '/style-ripple',
    component: () => import('@/views/openlayers/StyleRipple.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'AreaShow',
    path: '/area-show',
    component: () => import('@/views/openlayers/AreaShow.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'DualScreenLinkage',
    path: '/dual-screen-linkage',
    component: () => import('@/views/openlayers/DualScreenLinkage.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'CoorConvert',
    path: '/coor-convert',
    component: () => import('@/views/openlayers/CoorConvert.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'SpatialAnalysis',
    path: '/spatial-analysis',
    component: () => import('@/views/openlayers/SpatialAnalysis.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'Overlay',
    path: '/overlay',
    component: () => import('@/views/openlayers/MapOverlay.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'IndoorMap',
    path: '/indoor-map',
    component: () => import('@/views/openlayers/IndoorMap.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'CalcCenter',
    path: '/calc-center',
    component: () => import('@/views/openlayers/CalcCenter.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'EventClick',
    path: '/event-click',
    component: () => import('@/views/openlayers/EventClick.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'PopupShow',
    path: '/popup-show',
    component: () => import('@/views/openlayers/PopupShow.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'GeoServerRequest',
    path: '/geoServer-request',
    component: () => import('@/views/openlayers/GeoServerRequest.vue'),
    meta: {
      keepAlive: false
    }
  },{
    name: 'CompTraffic',
    path: '/comp-traffic',
    component: () => import('@/views/openlayers/CompTraffic.vue'),
    meta: {
      keepAlive: false
    }
  }
]

// 创建路由实例并传递`routes`配置
const router = createRouter({
  history: createWebHashHistory(),  // 改为hash模式，在nginx部署时正常访问路由
  routes
})

export default router