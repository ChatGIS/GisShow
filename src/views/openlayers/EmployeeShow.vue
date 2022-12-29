<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import View from 'ol/View'
import { onMounted, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Coordinate } from 'ol/coordinate'
import { Point } from 'ol/geom'
import { Icon, Text, Style, Fill } from 'ol/style'
import getAssetsFile from '@/utils/sys-use'
import gisJson from '@/assets/gis_employees.json'
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay'

// 定义map
const mapObj = {
    center: [117.060907,36.665866],
    zoom: 12
}
let zoom = ref(0)
let map = new Map({})
onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, locateLayer],
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
    // 加载员工要素
    initEmployeeData()
    // 点击拾取
    map.on('click', function (e) {
        clickMap(e)
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

// 定位图层
const locateSource = new VectorSource({})
const locateLayer = new VectorLayer({
    source: locateSource,
})



// 关闭popup
// closer.onclick = function () {
//     popup.setPosition(undefined)
//     closer.blur()
//     return false
// }


// 定位点样式
const styleLocate = new Style({
    image: new Icon({
        src: getAssetsFile('locate-red.png'),
        size: [64, 64],
        offset: [-17, -5]
    }),
    text: new Text({
        text: '',
        font: '15px sans-serif',
        offsetX: -3,
        offsetY: -32,
        fill: new Fill({
            color: 'red'
        })
    })
})
// 动态创建样式
const createLabelStyle = (feature: any) => {
    return new Style({
        image: new Icon({
            src: getAssetsFile('locate-red.png'),
            size: [64, 64],
            offset: [-17, -5]
        }),
        text: new Text({
            text: isShowName.value ? feature.get('name') : '',
            font: '15px sans-serif',
            offsetX: -3,
            offsetY: -32,
            fill: new Fill({
                color: 'black'
            })
        })
    })
}
// 是否展示名称
const isShowName = ref(false)

// 加载员工要素
const initEmployeeData = () => {
    locateSource.clear()
    for(let i = 0; i < gisJson.length; i++) {
        const lonlat = gisJson[i].geometry as unknown as string
        if(!lonlat) continue
        const feature = new Feature({
            geometry: new Point(lonlat.split(',').map(Number) as Coordinate),
            id: gisJson[i].id,
            name: gisJson[i].name,
            department: gisJson[i].department,
            address: gisJson[i].address,
            onboarding_time: gisJson[i].onboarding_time,
            lonlat: gisJson[i].geometry
        })
        feature.setStyle(createLabelStyle(feature))
        locateSource.addFeature(feature)
    }
}
// 名称展示切换
const toggleShowName = () => {
    initEmployeeData()
}
// 监听鼠标单击事件，点击feature后弹出popup
function clickMap(e: any) {debugger
    // 获取popup的dom对象
    var container = document.getElementById('popup')
    var content = document.getElementById('popup-content') as HTMLElement
    var closer = document.getElementById('popup-closer') as HTMLElement

    // 创建popup
    var popup = new Overlay({
        element: container as HTMLElement,
        autoPan: true,
        positioning: 'bottom-center',
        stopEvent: false,
        // autoPanAnimation: {
        //     duration: 250
        // }
    })
    map.addOverlay(popup)

    var coordinate = e.coordinate
    var feature = map.forEachFeatureAtPixel(e.pixel, function (feature, locateLayer) {
        return feature
    })
    if (feature) {
        // 清空html
        content.innerHTML = ''

        // 城市名称
        var cityName = document.createElement('h2')
        cityName.innerText = feature.get('id')
        content.appendChild(cityName)

        // 省份编码
        var provinceCode = document.createElement('p')
        provinceCode.innerText = '省份编码：' + feature.get('name')
        content.appendChild(provinceCode)

        // 拼音
        var pinyin = document.createElement('p')
        pinyin.innerText = '拼音：' + feature.get('department')
        content.appendChild(pinyin)

        // 归属
        var attribution = document.createElement('p')
        attribution.innerText = '归属：' + feature.get('address')
        content.appendChild(attribution)

        // 城市编码
        var cityCode = document.createElement('p')
        cityCode.innerText = '城市编码：' + feature.get('onboarding_time')
        content.appendChild(cityCode)

        // 纬度
        var latitude = document.createElement('p')
        latitude.innerText = '纬度：' + feature.get('lonlat')
        content.appendChild(latitude)

        // 弹出popup
        popup.setPosition(coordinate)
    }
}
</script>

<template>
    <div id="zoom-level-now">当前级别：{{zoom}}</div>
    <div id="map" class="map"></div>
    <el-card id="geocode-card">
        <span>展示名称</span>
        <el-switch v-model="isShowName" @change="toggleShowName"/>
        <!-- <el-button type="info">清空</el-button>
        <el-button type="primary">地理编码</el-button>
        <el-button type="primary">逆地理编码</el-button> -->
        <!-- <el-button type="primary" @click="temp">临时</el-button> -->
    </el-card>
    <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
    </div>
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

#geocode-card {
    position: absolute;
    top: 10px;
    left: 40px;
}
.el-input {
    margin-bottom: 10px;
}

.ol-popup {
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    filter: drop-shadow(0 1px 4px #FFC125);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 200px;
}

.ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}

.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}

.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
    color: red;
}

.ol-popup-closer:after {
    content: "✖";
}
</style>