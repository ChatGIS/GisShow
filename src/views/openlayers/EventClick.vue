<!--
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2024-05-20 22:45:10
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-18 22:52:46
 * @FilePath: \GisShow\src\views\openlayers\EventClick.vue
 * @Description: 
-->
<script setup>
import 'ol/ol.css'
import { Feature, Map, View } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { onMounted, ref } from 'vue'
import { LineString } from 'ol/geom'

// 定义map
const mapObj = {
  center: [117.024, 36.676],
  zoom: 15
}
let zoom = ref(0)

const sourceDraw = new VectorSource({
  features: [new Feature({
    geometry: new LineString([[117.005493,37.455933],[116.410858,36.873657],[118.050568,37.041199],[116.104614,36.3573]])
  })]
})
const vectorDraw = new VectorLayer({
  source: sourceDraw,
})
onMounted(() => {
  const map = new Map({
    layers: [gaodeTileLayer, vectorDraw],
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
  vectorDraw.on('singleclick', e => {
    console.log(e, 'eeeeeeeeeeeeeeeeeeeee')
  })
})

// 高德瓦片
const gaodeTileLayer = new TileLayer({
  source: new XYZ({
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