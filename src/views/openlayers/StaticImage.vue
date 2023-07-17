<script setup lang='ts'>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import { onMounted, ref } from 'vue'
import ImageLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'

const map = ref()

onMounted(() => {
    map.value = new Map({
        target: 'mapContainer',
        view: new View({
            center: [116.397057,39.917315],
            zoom: 16,
            projection: 'EPSG:4326',
        }),
        layers: [
            new TileLayer({
                source: new XYZ({
                    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
                })
            }),
            new ImageLayer({
                source: new Static({
                    url: 'https://img.dpm.org.cn/Public/static/themes/image/xf/yiqing.png',
                    imageExtent: [116.391172, 39.910187, 116.402834, 39.92365]
                })
            })
        ]
    }),
    setTimeout(() => {
        map.value.getView().fit([116.391172, 39.910187, 116.402834, 39.92365])
    }, 5000)
})

</script>

<template>
    <div id="mapContainer"></div>
</template>

<style scoped>
#mapContainer {
    width: 100%;
    height: 100%;
}
</style>