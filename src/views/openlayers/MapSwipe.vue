<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import View from 'ol/View'
import { onMounted, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { Size } from 'ol/size'
import { getRenderPixel } from 'ol/render'

// 定义map
const mapObj = {
    center: [117.024, 36.676],
    zoom: 15
}
let map = new Map()
onMounted(() => {
    map = new Map({
        layers: [layerTileBaseGaode, layerTileSatelliteGaode],
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

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position') as HTMLElement
})
// 滑动条
const sliderVal = ref(50)
// 改变滑动条
const changeSlider = () => {
    console.log(sliderVal.value)
    map.render()
}
// 图层渲染
layerTileSatelliteGaode.on('prerender', (evt) => {
    const ctx = evt.context as CanvasRenderingContext2D
    const mapSize = map.getSize() as Size
    const width = mapSize[0] * (sliderVal.value / 100)
    const tl = getRenderPixel(evt, [width, 0])
    const tr = getRenderPixel(evt, [mapSize[0], 0])
    const bl = getRenderPixel(evt, [width, mapSize[1]])
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
    const ctx = evt.context as CanvasRenderingContext2D
    ctx.restore()
})
</script>

<template>
    <div id="map" class="map"></div>
    <el-slider v-model="sliderVal" :show-tooltip="false" @input="changeSlider"/>
</template>

<style scoped>
.map {
    width: 100%;
    height: calc(100% - 34px);
}

/* 鼠标位置坐标展示 */
:deep .custom-mouse-position {
    position: absolute;
    bottom: 20px;
    right: 20px;
}
</style>