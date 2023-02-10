<script setup lang='ts'>
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { onMounted } from 'vue'
let view = new View({
    projection: 'EPSG:4326',
    center: [108.961029, 34.208386],
    zoom: 12,
})
onMounted(() => {
    let map = new Map({
        target: 'mapContainer',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        view: view,
    })
    let map2 = new Map({
        target: 'mapContainer2',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        view: view,
    })
    let map3 = new Map({
        target: 'mapContainer3',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        view: view,
    })
    let map4 = new Map({
        target: 'mapContainer4',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        view: view,
    })
})
</script>

<template>
    <div id="mapContainer"></div>
    <div id="mapContainer2"></div>
    <div id="mapContainer3"></div>
    <div id="mapContainer4"></div>
</template>

<style scoped>
#mapContainer {
    width: 50%;
    height: 50%;
    left: 0;
    top: 0;
    position: absolute;
  }
  #mapContainer2 {
    width: 50%;
    height: 50%;
    right: 0;
    top: 0;
    position: absolute;
  }
  #mapContainer3 {
    width: 50%;
    height: 50%;
    left: 0;
    bottom: 0;
    position: absolute;
  }
  #mapContainer4 {
    width: 50%;
    height: 50%;
    right: 0;
    bottom: 0;
    position: absolute;
  }
</style>
  