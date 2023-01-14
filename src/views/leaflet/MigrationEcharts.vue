<script setup lang='ts'>
// 引入 leaflet js 文件 需要现在env.d.ts中主动声明
import * as L from 'leaflet'
/*import "leaflet-tilelayer-colorizr";*/
import 'leaflet/dist/leaflet.css'
import { onMounted } from 'vue'

onMounted(() => {
    const map = L.map('myLeaflet', {
    }).setView([30, 110], 4)
    // 加载高德基础地图
    let name = L.tileLayer(
        'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
    ).addTo(map)
})
</script>

<template>
    <div id="myLeaflet" class="leafletDiv"></div>
</template>

<style scoped>
.leafletDiv {
  width: 100%;
  height: 100%;
}
</style>