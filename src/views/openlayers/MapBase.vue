<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import View from 'ol/View'
import { onMounted, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import trainRoadJson from '@/assets/data/trainRoad1.json'
import saveAs from 'file-saver'
import transCoor from '@/utils/trans-coor'

// 定义map
const mapObj = {
    center: [117.024, 36.676],
    zoom: 15
}
let zoom = ref(0)

onMounted(() => {
    const map = new Map({
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
// 
const beidou = () => {
    const trainRoad: any[] = trainRoadJson
    const points = []
    for(let i = 0; i < trainRoad.length; i++) {
        const lon1 = parseFloat(trainRoad[i].longitude)
        const lat1 = parseFloat(trainRoad[i].latitude)
        if(lon1 === 0 || lat1 === 0) {
            continue
        }
        // 北斗转84
        let lon = Math.floor(lon1 / 100) + (lon1 % 100) / 60
        let lat = Math.floor(lat1 / 100) + (lat1 % 100) / 60
        
        // console.log(lon)
        // console.log(lat)
        // 84转gcj02
        const a = transCoor([lon, lat], 1, 2)
        lon = parseFloat(a[0].toFixed(7))
        lat = parseFloat(a[1].toFixed(7))
        // console.log(a)
        // console.log(lon)
        // console.log(lat)
        trainRoad[i].lon = lon
        trainRoad[i].lat = lat
        points.push([lon, lat])
    }
    var file1 = new File([JSON.stringify(trainRoad)], 'trainRoad.json', {type: 'text/plain;charset=utf-8'})
    // saveAs(file1)
    const lineJson = {'type':'FeatureCollection','features':[{'type':'Feature','geometry':{'type':'LineString','coordinates':points},'properties':null}]}
    var file2 = new File([JSON.stringify(lineJson)], 'trainRoad.geojson', {type: 'text/plain;charset=utf-8'})
    saveAs(file2)
}
</script>

<template>
    <el-button @click="beidou">北斗坐标转换并下载文件</el-button>
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