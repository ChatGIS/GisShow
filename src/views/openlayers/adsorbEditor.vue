<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import {XYZ, Vector as VectorSource} from 'ol/source'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {Draw, Modify, Snap} from 'ol/interaction'
import { Style, Stroke } from 'ol/style'
import { ref, onMounted } from 'vue'

let map = new Map({})
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url:'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})

const source = new VectorSource()
const vector = new VectorLayer({
    source: source,
})

onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, vector],
        target: 'map',
        view: new View({
            center: [117, 37],
            zoom: 10,
            projection: 'EPSG:4326',
        })
    })

    const modify = new Modify({source: source})
    map.addInteraction(modify)
})

let draw, snap
// const typeSelect = document.getElementById('type');
const addInteractions = () => {
    draw = new Draw({
        source: source,
        type: 'Point',
    })
    map.addInteraction(draw)
    snap = new Snap({source: source})
    map.addInteraction(snap)
}
addInteractions()
</script>

<template>
    <div id="map" class="map"></div>
    <form>
      <label for="type">Geometry type &nbsp;</label>
      <select id="type">
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
        <option value="Circle">Circle</option>
      </select>
    </form>
    <button @click="addInteractions">编辑</button>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}
</style>