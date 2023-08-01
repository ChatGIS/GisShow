<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-07-19 15:39:13
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-07-20 16:51:09
 * @FilePath: \GisShow\src\views\openlayers\StaticImage2.vue
 * @Description: 
-->
<script setup lang='ts'>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import { onMounted, ref } from 'vue'
import ImageLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
import GeoImage from 'ol-ext/source/GeoImage'
import GeoImageLayera from 'ol-ext/layer/GeoImageLayer'

const map = ref()

onMounted(() => {
    map.value = new Map({
        target: 'mapContainer',
        view: new View({
            center: [116.602922,37.091039],
            zoom: 10,
            projection: 'EPSG:4326',
        }),
        layers: [
            new TileLayer({
                source: new XYZ({
                    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
                })
            }),
            /* new GeoImageLayera({
                source: new GeoImage({
                    url: 'https://img.zcool.cn/community/010bbc58229163a84a0e282b16c0c6.jpg?x-oss-process=image/format,webp',
                    imageCenter: [117.602922,37.071039],
                    imageScale: [1,1],
                    imageCrop: [116.602922,36.047337,118.110795,37.091039],
                    imageMask: [[116.602922,37.091039],[116.602922,36.047337],[118.110795,36.06931],[118.044877,37.231114],[116.602922,37.091039]],
                    imageRotate: Math.PI/180,
                    // projection: 'EPSG:4326',
                })
            }) */
        ]
    })
    /* setTimeout(() => {
        map.value.getView().fit([116.391172, 39.910187, 116.402834, 39.92365])
    }, 5000) */
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