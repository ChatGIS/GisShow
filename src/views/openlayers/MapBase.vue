<!--
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2023-07-18 22:11:00
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-18 22:33:32
 * @FilePath: \GisShow\src\views\openlayers\MapBase.vue
 * @Description: 基础地图
-->
<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { onMounted, ref } from 'vue'
import gcjMecator from '@/utils/gcj02ToWgs84.js'


// 定义map
const mapObj = {
  center: [117.024, 36.676],
  zoom: 15
}
let zoom = ref(0)

onMounted(() => {
  const map = new Map({
    layers: [gaodeTileLayer],
    target: 'map',
    view: new View({
      center: mapObj.center,
      zoom: mapObj.zoom,
      projection: 'EPSG:4326',
    })
  })
  // 添加鼠标位置
  map.addControl(controlMousePosition)
  // 获取地图层级
  map.on('moveend', () => {
    zoom.value = Math.round(map.getView().getZoom())
  })
})

// 高德瓦片
const gaodeTileLayer = new TileLayer({
  source: new XYZ({
    projection: gcjMecator,
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
  })
})

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
  coordinateFormat: createStringXY(6),
  projection: 'EPSG:4326',
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position')
})
</script>

<template>
    <div id="zoom-level-now">当前级别：{{zoom}}</div>
    <div id="map" class="map"></div>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}

/* 鼠标位置坐标展示 */
:deep .custom-mouse-position {
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 15px;   /*设置文字大小*/
    color:#3366FF;  /*设置文字颜色*/
    text-shadow: 0 8px 10px #6699FF;  /*设置文字阴影*/                  
    font-weight: bolder;  /*设置文字宽度*/      
}

#zoom-level-now {
    position: absolute;
    bottom: 20px;
    right: 200px;
    z-index: 1;
    font-size: 15px;   /*设置文字大小*/
    color:#3366FF;  /*设置文字颜色*/
    text-shadow: 0 8px 10px #6699FF;  /*设置文字阴影*/                  
    font-weight: bolder;  /*设置文字宽度*/                              
}
</style>