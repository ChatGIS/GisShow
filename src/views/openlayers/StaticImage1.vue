<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-06-20 16:40:39
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-07-19 15:37:30
 * @FilePath: \GisShow\src\views\openlayers\StaticImage1.vue
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
import { Projection, addCoordinateTransforms, addProjection, get as getProjection, getTransform, transform } from 'ol/proj'
import { rotate } from 'ol/coordinate'
import { getCenter } from 'ol/extent'
import * as proj4 from 'proj4'

const map = ref()

onMounted(() => {
    const extent = [112.4501, 34.536965, 112.4771, 34.556965]
    const projection = new Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extent,
    })
    map.value = new Map({
        target: 'mapContainer',
        view: new View({
            // center: [116.397057,39.917315],
            center: [112.4771, 34.556965],
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
                    url: 'https://img.zcool.cn/community/010bbc58229163a84a0e282b16c0c6.jpg?x-oss-process=image/format,webp',
                    projection: rotateProjection(projection, Math.PI / 4, extent),
                    imageExtent: extent,
                })
            }),
            new ImageLayer({
                source: new Static({
                    url: 'https://img.zcool.cn/community/010bbc58229163a84a0e282b16c0c6.jpg?x-oss-process=image/format,webp',
                    // projection: rotateProjection(projection, Math.PI / 2, extent),
                    imageExtent: extent,
                })
            })
        ]
    })
    /* setTimeout(() => {
        map.value.getView().fit([116.391172, 39.910187, 116.402834, 39.92365])
    }, 5000) */
})

function rotateProjection(projection: Projection, angle: number, extent: number[]) {
    function rotateCoordinate(coordinate: number[], angle: number, anchor: any[]) {
        var coord = rotate(
            [coordinate[0] - anchor[0], coordinate[1] - anchor[1]],
            angle
        )
        return [coord[0] + anchor[0], coord[1] + anchor[1]]
    }

    function rotateTransform(coordinate: any) {
        return rotateCoordinate(coordinate, angle, getCenter(extent))
    }

    function normalTransform(coordinate: any) {
        return rotateCoordinate(coordinate, -angle, getCenter(extent))
    }

    var normalProjection = getProjection(projection)

    var rotatedProjection = new Projection({
        code:
      normalProjection?.getCode() +
      ':' +
      angle.toString() +
      ':' +
      extent.toString(),
        units: normalProjection?.getUnits(),
        extent: extent,
    })
    addProjection(rotatedProjection)

    addCoordinateTransforms(
        projection,
        rotatedProjection,
        rotateTransform,
        normalTransform
    )

    addCoordinateTransforms(
        'EPSG:4326',
        rotatedProjection,
        function (coordinate: any) {
            return rotateTransform(transform(coordinate, 'EPSG:4326', projection))
        },
        function (coordinate: any) {
            return transform(normalTransform(coordinate), projection, 'EPSG:4326')
        }
    )

    addCoordinateTransforms(
        'EPSG:3857',
        rotatedProjection,
        function (coordinate: any) {
            return rotateTransform(transform(coordinate, 'EPSG:3857', projection))
        },
        function (coordinate: any) {
            return transform(normalTransform(coordinate), projection, 'EPSG:3857')
        }
    )

    // also set up transforms with any projections defined using proj4
    if (typeof proj4 !== 'undefined') {
        var projCodes = Object.keys(proj4.default.defs)
        projCodes.forEach(function (code) {
            var proj4Projection = getProjection(code) as Projection
            if(!proj4Projection) {
                return
            }
            if (!getTransform(proj4Projection, rotatedProjection)) {
                addCoordinateTransforms(
                    proj4Projection,
                    rotatedProjection,
                    function (coordinate: any) {
                        return rotateTransform(
                            transform(coordinate, proj4Projection, projection)
                        )
                    },
                    function (coordinate: any) {
                        return transform(
                            normalTransform(coordinate),
                            projection,
                            proj4Projection
                        )
                    }
                )
            }
        })
    }

    return rotatedProjection
}

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