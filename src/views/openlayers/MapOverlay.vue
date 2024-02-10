<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-02-06 10:05:39
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-02-20 14:06:48
 * @FilePath: \GisShow\src\views\openlayers\MapOverlay.vue
 * @Description: 
-->
<script setup>
import 'ol/ol.css'
import { Map, View, Overlay } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { onMounted, ref } from 'vue'

// 定义map
const mapObj = {
    center: [117.024, 36.676],
    zoom: 15
}
let zoom = ref(0)
let map = new Map({})
let container, content, closer, overlay
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
        zoom.value = Math.round(map.getView().getZoom())
    })

    container = document.getElementById('popup')
    content = document.getElementById('popup-content')
    console.log(content, 'log')
    closer = document.getElementById('popup-closer')
    overlay = new Overlay({
        element: container,
    })
    map.addOverlay(overlay)
    // 地图点击事件
    map.on('singleclick', evt => {
        // dynamicPopup(evt)
        stablePopup(evt)
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
    target: document.getElementById('mouse-position')
})
// 动态生成overlay
const dynamicPopup = evt => {
    const eleOverlay = document.createElement('div')
    eleOverlay.id = 'popup-dynamic'
    eleOverlay.className = 'popup-dynamic'
    eleOverlay.innerHTML = 'ChatGIS当前坐标：' + evt.coordinate
    const marker = new Overlay({
        id: 'popup-dynamic',
        position: evt.coordinate,
        element: eleOverlay
    })
    map.removeOverlay(map.getOverlayById('popup-dynamic'))
    map.addOverlay(marker)
}
// 固定element的Overlay
const stablePopup = evt => {
    const coordinate = evt.coordinate
    content.innerHTML = '<p>当前坐标:</p><code>' + coordinate + '</code>'
    overlay.setPosition(coordinate)
}
const closePopup = () => {
    overlay.setPosition(undefined)
    closer.blur()
    return false
}
</script>

<template>
    <div id="popup" class="ol-popup">
      <h2>ChatGIS</h2>
      <a id="popup-closer" class="ol-popup-closer" @click="closePopup"></a>
      <div id="popup-content"></div>
    </div>
    <div id="map" class="map"></div>
    <div id="zoom-level-now">当前级别：{{zoom}}</div>
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
    font-size: 15px;   /*设置文字大小*/
    color:#3366FF;  /*设置文字颜色*/
    text-shadow: 0 8px 10px #6699FF;  /*设置文字阴影*/                  
    font-weight: bolder;  /*设置文字宽度*/      
}

#zoom-level-now {
    position: absolute;
    bottom: 20px;
    right: 200px;
    z-index: 1;
    font-size: 15px;   /*设置文字大小*/
    color:#3366FF;  /*设置文字颜色*/
    text-shadow: 0 8px 10px #6699FF;  /*设置文字阴影*/                  
    font-weight: bolder;  /*设置文字宽度*/                              
}
:deep #popup-dynamic {
    min-width: 200px;
    height: 20px;
    border: 1px solid #088;
    background-color: #0FF;
}
.ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
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
}
.ol-popup-closer:after {
    content: "✖";
}
</style>