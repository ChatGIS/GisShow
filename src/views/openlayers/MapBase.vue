<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { onMounted } from 'vue'
import mapMenu from '../../components/mapMenu/index.vue'
import { OSM } from 'ol/source'

let map = new Map({})
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url:'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})

const osmLayer = new TileLayer({
    source: new OSM()
})
const mapLayers = [{
    id: 1,
    name: '高德底图',
    layer: gaodeTileLayer,
    check: true
},{
    id: 2,
    name: 'OSM底图',
    layer: 'osmLayer',
    check: false
}]

onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, osmLayer],
        target: 'map',
        view: new View({
            center: [117, 37],
            zoom: 10,
            projection: 'EPSG:4326',
        })
    })
})
</script>

<template>
    <el-card class="box-card">
        <el-checkbox v-for="(item) in mapLayers" :key="item.id" v-model="item.check" :label="item.name" size="large" />
    </el-card>
    <div id="map" class="map">
    </div>
</template>

<style scoped>
    .map {
        width: 100%;
        height: 100%;
    }

    #mapMenu {
        z-index: 1;
        position: absolute;
        top: 40px;
        left: 50px;
    }
</style>