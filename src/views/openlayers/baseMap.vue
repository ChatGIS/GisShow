<script setup lang='ts'>
    import 'ol/ol.css'
    import Map from 'ol/Map'
    import OSM from 'ol/source/OSM'
    import TileLayer from 'ol/layer/Tile'
    import View from 'ol/View'
    import XYZ from 'ol/source/XYZ'
    import { ref, onMounted } from 'vue'
    import { distancePtPt } from '../../utils/distance'
    import mapMenu from '../../components/mapMenu/index.vue'
    
    const distance = ref(0);
    distance.value = distancePtPt("112.5007257350843,37.902408272070495,112.50733183000011,37.90022938800007");

    const map = ref();
    const gaodeTileLayer = new TileLayer({
		source: new XYZ({
			url:'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
		})
	});
    
    const osmTileLayer = new TileLayer({
        source: new OSM()
    })

    onMounted(() => {
        map.value = new Map({
        layers: [gaodeTileLayer, osmTileLayer         
        ],
        target: 'map',
        view: new View({
            center: [117, 37],
            zoom: 10,
            projection: "EPSG:4326",
        })
    })
    })
    


</script>

<template>
    <mapMenu id="mapMenu" :map="map"></mapMenu>
    <span>{{distance}}</span>
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