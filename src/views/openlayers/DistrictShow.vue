<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-08-14 23:50:33
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-08-16 11:01:30
 * @FilePath: \GisShow\src\views\openlayers\DistrictShow.vue
 * @Description: 
-->
<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { XYZ } from 'ol/source'
import View from 'ol/View'
import { onMounted, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import VectorSource from 'ol/source/Vector'

let map = new Map({})
const mapObj = {
    center: [105, 36],
    zoom: 3
}
let zoom = ref(0)

onMounted(() => {
    map = new Map({
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
        zoom.value = Math.round(map.getView().getZoom() as number)
    })
})

// 高德瓦片
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
    })
})
// 
const layerChina = new Vector({
    source: new VectorSource({
        
    })
})

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position') as HTMLElement
})
</script>

<template>
    <div id="zoom-level-now">当前级别：{{zoom}}</div>
    <div id="map" class="map"></div>
</template>

<style scoped>
.map {
    position: absolute;
    width: 100%;
    height: 80%;
    top: 25%;
}

/* 鼠标位置坐标展示 */
:deep .custom-mouse-position {
    position: absolute;
    bottom: 20px;
    right: 20px;
}

#zoom-level-now {
    position: absolute;
    bottom: 20px;
    right: 200px;
    z-index: 1;
}
</style>