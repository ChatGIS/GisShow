<script setup>
import 'ol/ol.css'
import Map from 'ol/Map'
import Feature from 'ol/Feature'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import View from 'ol/View'
import { GeoJSON } from 'ol/format'
import { Style, Icon, Fill, Text, Circle as CircleStyle, Stroke } from 'ol/style'
import { onMounted, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import {  isValid } from '@/utils/spatial-analysis'
import transCoor from '@/utils/trans-coor'
import { Polygon } from 'ol/geom'

// 定义map
const mapObj = {
    center: [119.12211558, 36.71875371],
    zoom: 15
}
let zoom = ref(0)

onMounted(() => {
    const map = new Map({
        layers: [gaodeTileLayer, layerBaoquGaode],
        target: 'map',
        view: new View({
            center: mapObj.center,
            zoom: mapObj.zoom,
            projection: 'EPSG:4326',
        })
    })
    // 添加鼠标位置
    map.addControl(controlMousePosition)
    // 获取地图层级
    map.on('moveend', () => {
        zoom.value = Math.round(map.getView().getZoom())
    })
})

// 高德瓦片
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})

const layerBaoquGaode = new Vector({
    source: new VectorSource({}),
    style: feature => {
        const is = feature.get('is')
        let color = '#ff000099'
        if(!is) {
            color = '#42b98399'
        }
        return new Style({
            fill: new Fill({
                color: color
            }),
            stroke: new Stroke({
                color: 'red',
            }),
            text: new Text({
                text: feature.get('name')
            })
        })
    }
})

const layerBaoquWgs = new Vector({
    source: new VectorSource({
        url: 'gisdata/0536baoqu.geojson',
        format: new GeoJSON(),
        zIndex: 1,
    }),
    style: feature => {
        return new Style({
            fill: new Fill({
                color: '#134d154d'
            }),
            stroke: new Stroke({
                color: 'red',
            }),
            text: new Text({
                text: feature.get('name')
            })
        })
    }
})

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position')
})
function giveLaoziLoad() {
    fetch('/gisdata/0536baoqu.geojson')
        .then(res1 => res1.json())
        .then(res => {
            const features = res.features
            for(let i = 0; i < features.length; i++) {
                const name = features[i].properties.NAME
                const coor = features[i].geometry.coordinates[0]
                // 异常数据处理
                if(coor == 0) {
                    continue
                }
                const newLineArr = []
                let aa = ''
                for(let j = 0; j < coor.length; j++) {
                    let a = transCoor(coor[j], 1, 2)
                    newLineArr.push(a)

                    const b = coor[j][0] + ',' + coor[j][1]
                    if(j === coor.length - 1) {
                        aa += b
                    } else {
                        aa += b + ','
                    }
                }
                const is = isValid(aa)
                const fea = new Feature({
                    geometry: new Polygon([newLineArr]),
                    name: name,
                    is: is
                })
                layerBaoquGaode.getSource().addFeature(fea)
            }
        })
}
</script>

<template>
    <el-button @click="giveLaoziLoad">给我加载</el-button>
    <div id="zoom-level-now">当前级别：{{zoom}}</div>
    <div id="map" class="map"></div>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}

/* 鼠标位置坐标展示 */
:deep .custom-mouse-position {
    position: absolute;
    bottom: 20px;
    right: 20px;
}

#zoom-level-now {
    position: absolute;
    bottom: 20px;
    right: 200px;
    z-index: 1;
}
</style>