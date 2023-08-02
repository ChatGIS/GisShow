<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-07-19 14:30:14
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-08-01 23:32:48
 * @FilePath: \GisShow\src\views\openlayers\StaticImage.vue
 * @Description: 
-->
<script setup lang='ts'>
import 'ol/ol.css'
import { Feature, Map, View } from 'ol'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { onMounted, ref } from 'vue'
import ImageLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
// import ImgSuidao2 from '@/assets/image/suidao2.jpg'
import ImgSuidao2 from '@/assets/image/suidao21.png'
import { Point } from 'ol/geom'
import { Style, Circle as CircleStyle, Fill, Text } from 'ol/style'

const map = ref()

onMounted(() => {
    // 左上、右上、右下、左下
    const four = [[108.07117747198237, 24.392007671359593], [108.07159380169678, 24.39470651497463], [108.07303816899555, 24.394523604074635], [108.07261826918632, 24.391825240375738]]

    map.value = new Map({
        target: 'mapContainer',
        view: new View({
            center: four[0],
            zoom: 18,
            projection: 'EPSG:4326',
        }),
        layers: [
            new TileLayer({
                source: new XYZ({
                    url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}',
                    maxZoom: 16,
                })
            }),
            new ImageLayer({
                source: new Static({
                    url: ImgSuidao2,
                    imageExtent: [four[1][0], four[3][1], four[3][0], four[1][1]]
                }),
                opacity: 0.4
            }),
        ]
    })
    const sourceFour = new VectorSource({})
    const layerFour = new Vector({
        source: sourceFour,
        style: feature => {
            return new Style({
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                        color: 'red'
                    })
                }),
                text: new Text({
                    text: (feature.get('id') + 1).toString(),
                })
            })
        }
    })
    map.value.addLayer(layerFour)

    four.forEach((arr, index) => {
        const featureFour = new Feature({
            geometry: new Point(arr),
            id: index,
        })
        sourceFour.addFeature(featureFour)
    })
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