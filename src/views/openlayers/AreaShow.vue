<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-02-06 10:05:39
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-05-24 09:15:33
 * @FilePath: \GisShow\src\views\openlayers\AreaShow.vue
 * @Description: 
-->
<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { GeoJSON } from 'ol/format'
import { Style, Stroke } from 'ol/style'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { onMounted, ref } from 'vue'

// 定义map
const mapObj = {
    center: [104, 34.676],
    zoom: 5
}
let zoom = ref(0)
// 省图层
const layerProvinceTDT = new Vector({
    source: new VectorSource({
        url: 'gisdata/ChinaProvinceTDT.geojson',
        format: new GeoJSON(),
        zIndex: 1,
    }),
    style: new Style({
        stroke: new Stroke({
            color: '#000000'
        })
    })
})
onMounted(() => {
    const map = new Map({
        layers: [gaodeTileLayer, layerProvinceTDT],
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

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position')
})
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
</style>