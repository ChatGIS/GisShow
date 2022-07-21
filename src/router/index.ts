import { createRouter, createWebHistory,RouteRecordRaw } from 'vue-router'

const routes:Array<RouteRecordRaw> = [{
    path: "/arcgismap",
    component: () => import('../views/arcgis/DisplayAMap.vue')
},
{
    path: "/olmap",
    component: () => import('../views/tile.vue')
}
]

const router = createRouter({
    history: createWebHistory("/gisshow"),    // 设置根目录
    routes
})

export default router