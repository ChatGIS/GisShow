<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-07-19 14:30:30
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-08-02 16:09:50
 * @FilePath: \GisShow\src\views\openlayers\StaticImage1.vue
 * @Description: 
-->
<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-06-20 16:40:39
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-08-01 16:58:32
 * @FilePath: \GisShow\src\views\openlayers\StaticImage1.vue
 * @Description: 
-->
<script setup lang='ts'>
import 'ol/ol.css'
import { Feature, Map, View } from 'ol'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { XYZ } from 'ol/source'
import { onMounted, ref } from 'vue'
import ImageLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
import { Projection, addCoordinateTransforms, addProjection, get as getProjection, getTransform, transform } from 'ol/proj'
import { Coordinate, rotate } from 'ol/coordinate'
import { getCenter } from 'ol/extent'
import * as proj4 from 'proj4'
import ImgSuidao2 from '@/assets/image/suidao2.jpg'
import { getImageCenter, getImageHorizontalExtent, getImageRotateRadian } from '@/utils/image-georeference'
import VectorSource from 'ol/source/Vector'
import { Fill, Style, Text } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import { Point } from 'ol/geom'

const map = ref()

onMounted(() => {
    // 左上、右上、右下、左下
    const four = [[108.07117747198237, 24.392007671359593], [108.07159380169678, 24.39470651497463], [108.07303816899555, 24.394523604074635], [108.07261826918632, 24.391825240375738]]
    // const four = [[108.07117747198237, 24.392007671359593], [108.07159380169678, 24.39470651497463], [108.07303816899555, 24.394523604074635], [108.07261826918632, 24.391825240375738]]
    const center = getImageCenter(four)
    const extent = getImageHorizontalExtent(four)
    const b = getImageRotateRadian(four[1], four[0])
    console.log(b)
    const fourA = [[extent[0], extent[3]], [extent[2], extent[3]], [extent[2], extent[1]], [extent[0], extent[1]]]
    
    
    // const extent = [112.4501, 34.536965, 112.4771, 34.556965]
    // const extent = [four[1][0], four[3][1], four[3][0], four[1][1]]
    const projection = new Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extent,
    })
    map.value = new Map({
        target: 'mapContainer',
        view: new View({
            center: center,
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
                    projection: rotateProjection(projection, b, extent),
                    imageExtent: extent,
                }),
                opacity: 0.6
            }),
            new ImageLayer({
                source: new Static({
                    url: ImgSuidao2,
                    // projection: rotateProjection(projection, Math.PI / 2, extent),
                    imageExtent: extent,
                }),
                opacity: 0,
            })
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
    four.forEach((a, i) => {
        sourceFour.addFeature(new Feature({
            geometry: new Point(a),
            id: i,
        }))
    })

    const sourceExtent = new VectorSource({})
    const layerExtent = new Vector({
        source: sourceExtent,
        style: feature => {
            return new Style({
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                        color: 'yellow'
                    })
                }),
                text: new Text({
                    text: (feature.get('id') + 1).toString(),
                })
            })
        }
    })
    map.value.addLayer(layerExtent)
    fourA.forEach((a, i) => {
        sourceExtent.addFeature(new Feature({
            geometry: new Point(a),
            id: i,
        }))
    })

    const layerCenter1 = new Vector({
        source: new VectorSource({
            features: [new Feature({
                geometry: new Point(center)
            })]
        }),
        style: feature => {
            return new Style({
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                        color: 'blue'
                    })
                }),
                text: new Text({
                    text: '1',
                })
            })
        }
    })
    map.value.addLayer(layerCenter1)

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