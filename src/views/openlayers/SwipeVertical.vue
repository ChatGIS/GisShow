<!--
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2024-05-15 22:46:19
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-18 22:54:05
 * @FilePath: \GisShow\src\views\openlayers\SwipeVertical.vue
 * @Description: 
-->

<script setup>
import 'ol/ol.css'
import { Feature, View } from 'ol'
import Map from 'ol/Map'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { Vector as VectorSource, XYZ } from 'ol/source'
import { onMounted, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { getRenderPixel } from 'ol/render'
import { LineString } from 'ol/geom'
import { Fill, Stroke, Style, Text } from 'ol/style'


// 定义map
const mapObj = {
  center: [116.881462,36.623733],
  zoom: 15
}
let map = new Map()
onMounted(() => {
  map = new Map({
    layers: [layerTileBaseGaode, layerTileSatelliteGaode, layerPolygon1, layerPolygon2],
    target: 'map',
    view: new View({
      center: mapObj.center,
      zoom: mapObj.zoom,
      projection: 'EPSG:4326',
    })
  })
  // 添加鼠标位置
  map.addControl(controlMousePosition)
})

// 高德基础瓦片图层
const layerTileBaseGaode = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
  })
})
// 高德卫星影像瓦片图层
const layerTileSatelliteGaode = new TileLayer({
  source: new XYZ({
    url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
  })
})

const sourcePolygon1 = new VectorSource({})
const layerPolygon1 = new Vector({
  source: sourcePolygon1
})
const sourcePolygon2 = new VectorSource({})
const layerPolygon2 = new Vector({
  source: sourcePolygon2
})
const feature1 = new Feature(new LineString([[116.895122,36.68242],[116.895225,36.672439],[116.893784,36.671307],[116.893784,36.666677],[116.895122,36.665648],[116.894299,36.649184],[116.892858,36.644657],[116.892447,36.640952],[116.891829,36.634984],[116.891932,36.626753],[116.891829,36.624695],[116.889771,36.623871],[116.877768,36.623527],[116.871234,36.623363],[116.866824,36.622057],[116.86029,36.614543],[116.848367,36.595923]]))
sourcePolygon1.addFeature(feature1)

const feature21 = new Feature(new LineString([[116.895122,36.68242],[116.895225,36.672439],[116.893784,36.671307],[116.893784,36.666677],[116.895122,36.665648],[116.894299,36.649184],[116.892858,36.644657],[116.892447,36.640952],[116.891829,36.634984],[116.891932,36.626753],[116.891829,36.624695],[116.889771,36.623871],[116.877768,36.623527],[116.871234,36.623363],[116.866824,36.622057],[116.86029,36.614543],[116.848367,36.595923]]))
sourcePolygon2.addFeature(feature21)
const feature22 = new Feature(new LineString([[116.882339,36.624104],[116.901976,36.624207],[116.91925,36.629245],[116.931999,36.633357],[116.943103,36.648883],[116.954002,36.662352],[116.997405,36.676574],[117.025782,36.682332],[117.083976,36.699194],[117.104128,36.706391],[117.145797,36.71032],[117.197102,36.709703],[117.228255,36.709086]]))
sourcePolygon2.addFeature(feature22)
// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
  coordinateFormat: createStringXY(6),
  projection: 'EPSG:4326',
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position')
})
const styleP = new Style({
  stroke: new Stroke({
    color: 'blue',
    width: 3
  }),
  text: new Text({
    text: '2020年济南地铁',
    font: '13px sans-serif',
    offsetY: 20,
    fill: new Fill({
      color: 'blue'
    })
  })
})
layerPolygon1.setStyle(styleP)

const style2 = new Style({
  stroke: new Stroke({
    color: 'red',
    width: 5
  }),
  text: new Text({
    text: '2025年济南地铁',
    font: '13px sans-serif',
    offsetY: 20,
    fill: new Fill({
      color: '#FFFFFF'
    })
  })
})
layerPolygon2.setStyle(style2)

// 滑动条
const sliderVal = ref(50)
// 改变滑动条
const changeSlider = () => {
  console.log(sliderVal.value)
  map.render()
}
// 图层渲染
layerTileSatelliteGaode.on('prerender', (evt) => {
  const ctx = evt.context
  const mapSize = map.getSize()
  const height = mapSize[1] * ((100 - sliderVal.value) / 100)
  const tl = getRenderPixel(evt, [0, height])
  const tr = getRenderPixel(evt, [0, mapSize[1]])
  const bl = getRenderPixel(evt, [mapSize[0], height])
  const br = getRenderPixel(evt, mapSize)

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(tl[0], tl[1])
  ctx.lineTo(bl[0], bl[1])
  ctx.lineTo(br[0], br[1])
  ctx.lineTo(tr[0], tr[1])
  ctx.closePath()
  ctx.clip()
})
layerTileSatelliteGaode.on('postrender', (evt) => {
  const ctx = evt.context
  ctx.restore()
})

// 图层渲染
layerPolygon2.on('prerender', (evt) => {
  const ctx = evt.context
  const mapSize = map.getSize()
  const height = mapSize[1] * ((100 - sliderVal.value) / 100)
  const tl = getRenderPixel(evt, [0, height])
  const tr = getRenderPixel(evt, [0, mapSize[1]])
  const bl = getRenderPixel(evt, [mapSize[0], height])
  const br = getRenderPixel(evt, mapSize)

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(tl[0], tl[1])
  ctx.lineTo(bl[0], bl[1])
  ctx.lineTo(br[0], br[1])
  ctx.lineTo(tr[0], tr[1])
  ctx.closePath()
  ctx.clip()
})

layerPolygon2.on('postrender', (evt) => {
  const ctx = evt.context
  ctx.restore()
})
</script>

<template>
    <div class="main-container">
        <div id="map" class="map"></div>
        <div class="slider-container">
            <el-slider v-model="sliderVal" :show-tooltip="false" 
            @input="changeSlider" 
            vertical height="800px"/>
        </div>
    </div>
</template>

<style scoped>
.map {
    width: calc(100% - 40px);
    height: 800px;
}
.slider-container,.map {
    display: inline-block;
}
/* 鼠标位置坐标展示 */
:deep .custom-mouse-position {
    position: absolute;
    bottom: 20px;
    right: 20px;
}
</style>