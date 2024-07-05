<!--
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2023-11-26 23:35:58
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-18 22:52:28
 * @FilePath: \GisShow\src\views\openlayers\DualScreenLinkage.vue
 * @Description: 
-->

<template>
  <div class="map-container">
    <div class="left-map" id="leftMap"></div>
    <div class="right-map" id="rightMap"></div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'

const mapObj = {
  center: [117.024, 36.676],
  zoom: 15
}
const viewOne = new View({
  center: mapObj.center,
  zoom: mapObj.zoom,
  projection: 'EPSG:4326',
})
onMounted(() => {
  initMaps()
})

const initMaps = () => {
  // 创建左侧地图
  const leftMap = new Map({
    target: 'leftMap',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
        })
      })
    ],
    view: viewOne
  })

  // 创建右侧地图
  const rightMap = new Map({
    target: 'rightMap',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
        })
      })
    ],
    view: viewOne
  })
}
</script>
<style scoped>
.map-container {
  display: flex;
  height: 100%;
}

.left-map,
.right-map {
  flex: 1;
  height: 100%;
}
</style>