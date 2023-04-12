<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { Vector as VectorSource, XYZ } from 'ol/source'
import View from 'ol/View'
import { onMounted, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import Img from '@/assets/image/device_common.svg'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { Icon, Style,Circle as CircleStyle, Fill, Text } from 'ol/style'

// 定义map
const mapObj = {
    center: [117.024, 36.676],
    zoom: 15
}
let zoom = ref(0)
let map = new Map({})
onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer],
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
        zoom.value = Math.round(map.getView().getZoom() as number)
    })
    addFeature()
})

// 高德瓦片
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position') as HTMLElement
})

const addFeature = () => {
    const feature = new Feature(new Point(mapObj.center))
    const feature2 = new Feature(new Point(mapObj.center))
    feature.setStyle(new Style({
        image: new Icon({
            src: Img,
            // offset: [0.5, 16],
            // size: 20,
            anchor: [0.5, 0.9],
        // anchorOrigin: "bottom-left"
        }),
    }))
    feature2.setStyle(new Style({
        image: new CircleStyle({
            radius: 1,
            fill: new Fill({
                color: 'red',
            }),
        }),
        text: new Text({
            font: '12px Microsoft YaHei',
            fill: new Fill({
                color: '#ffffff',
            }),
            text: '大明湖站',
            // offsetX: 0,
            offsetY: 15,
        }),
    }))
    const layer = new Vector({
        source: new VectorSource({
            features: [feature, feature2]
        })
    })
    map.addLayer(layer)
}
</script>

<template>
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