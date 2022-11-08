<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import View from 'ol/View'
import { onMounted, reactive } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'

// 定义map
const mapObj = {
    center: [117.024, 36.676],
    zoom: 15
}
let map = new Map({})
onMounted(() => {
    map = new Map({
        // layers: [layerTileBaseGaode],
        target: 'map',
        view: new View({
            center: mapObj.center,
            zoom: mapObj.zoom,
            projection: 'EPSG:4326',
        })
    })
    // 添加鼠标位置
    map.addControl(controlMousePosition)
    // 初始化加载
    // map.addLayer(layerTileBaseGaode)
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
// 高德路网瓦片图层
const layerTileRoadNetGaode = new TileLayer({
    source: new XYZ({
        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}'
    })
})
// 高德路网瓦片图层
const layerTileBaseGaodeSmallLabel = new TileLayer({
    source: new XYZ({
        url: 'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}'
    })
})

// 图层集合
const layers = reactive([{
    name: '高德地图',
    layer: layerTileBaseGaode,
    check: false,
},{
    name: '高德卫星',
    layer: layerTileSatelliteGaode,
    check: false
},{
    name: '高德路网',
    layer: layerTileRoadNetGaode,
    check: false
},{
    name: '高德地图（小标注）',
    layer: layerTileBaseGaodeSmallLabel,
    check: false
}])

// 图层选择
const checkLayer = (check: boolean, layer: TileLayer<XYZ>) => {
    if(check){
        map.addLayer(layer)
    } else {
        map.removeLayer(layer)
    }
}

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position') as HTMLElement
})
</script>

<template>
    <el-card class="box-card">
        <div v-for="item in layers" :key="item.name" class="card-item">
            <el-checkbox v-model="item.check" :label="item.name" size="large" @change="checkLayer(item.check, item.layer as TileLayer<XYZ>)"/>
        </div>
    </el-card>
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
}
.box-card {
    position: absolute;
    top: 20px;
    left: 40px;
    z-index: 1;
}
.card-item {
    text-align: left;
}
</style>