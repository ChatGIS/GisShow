<script setup lang='ts'>
    import { ref, onMounted } from 'vue'
    import 'ol/ol.css'
    import Map from 'ol/Map'
    import View from 'ol/View'
    import XYZ from 'ol/source/XYZ'
    import TileLayer from 'ol/layer/Tile'

    import getColorLayer from '../../utils/tilecolor'

    const params = {
        mapCenter: [117, 37]
    }
    let map: Map = new Map({});
    const gaodeTileLayer = new TileLayer({
        source: new XYZ({
            // url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
            url: '/gaodetile/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
        })
    });

    onMounted(() => {
        loadMap()
    })

    function loadMap(){
        map = new Map({
            // layers: [],
            target: 'map',
            view: new View({
                center: params.mapCenter,
                zoom: 10,
                projection: "EPSG:4326",
            })
        })
        // 获取主题颜色图层
        let colorLayer = getColorLayer("gaode", "reversal")
         
        //添加到地图
        map.addLayer(colorLayer)
    }
</script>

<template>
    <div id="map" class="map"></div>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}
</style>