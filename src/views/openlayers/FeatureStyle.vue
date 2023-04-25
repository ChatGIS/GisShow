<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { Vector as VectorSource, XYZ } from 'ol/source'
import View from 'ol/View'
import { onMounted, reactive, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import Img from '@/assets/image/device_common.svg'
import { Feature } from 'ol'
import { LineString, Point } from 'ol/geom'
import { Icon, Style,Circle as CircleStyle, Fill, Text, RegularShape } from 'ol/style'
import StyleSetting from '@/utils/style-setting'
import IconFlag from '@/assets/image/flag.png'
import IconLocation from '@/assets/image/location.png'

// 定义map
const mapObj = {
    center: [117.024, 36.676],
    zoom: 13
}
let zoom = ref(0)
let map = new Map({})

let checkedPointCircle = ref(false)
let checkedPointTriangular = ref(false)
let checkedPointSquare = ref(false)
let checkedPointPentagram = ref(false)
let checkedPointArrowhead = ref(false)
let checkedPointIconFlag = ref(false)
let checkedPointIconLocation = ref(false)
let checkedLine = ref(false)


onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, layerStyle, layerPoint, layerLine],
        target: 'map',
        view: new View({
            center: mapObj.center,
            zoom: mapObj.zoom,
            projection: 'EPSG:4326',
        })
    })
    // 初始化图层数据
    initLayerData()
    // 添加鼠标位置
    map.addControl(controlMousePosition)
    // 获取地图层级
    map.on('moveend', () => {
        zoom.value = Math.round(map.getView().getZoom() as number)
    })
    // addFeature()
})

// 高德瓦片
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})
// 要素图层
const sourceStyle = new VectorSource({})
const layerStyle = new Vector({
    source: sourceStyle
})
const sourcePoint = new VectorSource({})
const layerPoint = new Vector({
    source: sourcePoint
})
const sourceLine = new VectorSource({})
const layerLine = new Vector({
    source: sourceLine
})
// 初始化图层数据
const initLayerData = () => {
    const count = 10
    const lineData = []
    for(let i = 0; i < 10; i++) {
        const operator1 = Math.random() > 0.5 ? '+' : '-'
        const operator2 = Math.random() > 0.5 ? '+' : '-'
        const lon = eval('mapObj.center[0]' + operator1 + '0.1 * Math.random() * Math.random()')
        const lat = eval('mapObj.center[1]' + operator2 + '0.05 * Math.random() * Math.random()')
        const feature = new Feature(new Point([lon, lat]))
        sourcePoint.addFeature(feature)

        lineData.push([lon, lat])
    }
    sourceLine.addFeature(new Feature(new LineString(lineData)))
}
// 样式要素
const featureArrowhead = new Feature(new Point([mapObj.center[0] + 0.002, mapObj.center[1] + 0.01]))

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
// 圆形
const toggleShowCircle = () => {
    const settings = {
        isShowStyle: 1,
        displayType: 'POINT',
        shapeCode: 1,
        shapeSize: 10,
        opacity: 50,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
    }
    if(!checkedPointCircle.value) {
        settings.isShowStyle = 0
    }
    StyleSetting.setLayerStyle(layerPoint, settings)
}
// 三角形
const toggleShowTriangular = () => {
    const settings = {
        isShowStyle: 1,
        displayType: 'POINT',
        shapeCode: 2,
        shapeSize: 20,
        opacity: 60,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
    }
    if(!checkedPointTriangular.value) {
        settings.isShowStyle = 0
    }
    StyleSetting.setLayerStyle(layerPoint, settings)
}
// 正方形
const toggleShowSquare = () => {
    const settings = {
        isShowStyle: 1,
        displayType: 'POINT',
        shapeCode: 3,
        shapeSize: 30,
        opacity: 70,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
    }
    if(!checkedPointSquare.value) {
        settings.isShowStyle = 0
    }
    StyleSetting.setLayerStyle(layerPoint, settings)
}
// 五角星
const toggleShowPentagram = () => {
    const settings = {
        isShowStyle: 1,
        displayType: 'POINT',
        shapeCode: 4,
        shapeSize: 40,
        opacity: 80,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
    }
    if(!checkedPointPentagram.value) {
        settings.isShowStyle = 0
    }
    StyleSetting.setLayerStyle(layerPoint, settings)
}
// 箭头
const toggleShowArrowhead = () => {
    if(checkedPointArrowhead.value) {
        featureArrowhead.setStyle(new Style({
            image: new RegularShape({
                points: 2,
                // radius: 20,
                fill: new Fill({
                    color: 'red'
                }),
                radius1: 20,
                radius2: 8,
                angle: 0
            })
        }))
        sourceStyle.addFeature(featureArrowhead)
    } else {
        sourceStyle.removeFeature(featureArrowhead)
    }
}
// 旗帜图标
const toggleShowIconFlag = () => {
    const settings = {
        isShowStyle: 1,
        displayType: 'BITMAP',
        shapeCode: 4,
        shapeSize: 40,
        opacity: 40,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
        width: 30,
        height: 30,
        xOffset: 30,
        yOffset: 30,
        srcIcon: IconFlag
    }
    if(!checkedPointIconFlag.value) {
        settings.isShowStyle = 0
    }
    StyleSetting.setLayerStyle(layerPoint, settings)
}
// 定位图标
const toggleShowIconLocation = () => {
    const settings = {
        isShowStyle: 1,
        displayType: 'BITMAP',
        shapeCode: 4,
        shapeSize: 40,
        opacity: 80,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
        width: 20,
        height: 20,
        xOffset: 10,
        yOffset: 10,
        srcIcon: IconLocation
    }
    if(!checkedPointIconLocation.value) {
        settings.isShowStyle = 0
    }
    StyleSetting.setLayerStyle(layerPoint, settings)
}
// 线样式
const toggleShowLine = () => {
    const settings = {
        isShowStyle: 1,
        displayType: 'LINE',
        shapeCode: 4,
        shapeSize: 40,
        opacity: 80,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
        width: 20,
        height: 20,
        xOffset: 10,
        yOffset: 10,
        srcIcon: IconLocation
    }
    if(!checkedLine.value) {
        settings.isShowStyle = 0
    }
    StyleSetting.setLayerStyle(layerPoint, settings)
}
</script>

<template>
    <el-container>
      <el-aside width="300px">
        <div id="ssss" class="style-container">
            <h5>点样式</h5>
            <div>
                <el-checkbox v-model="checkedPointCircle" label="圆形" size="large" @change="toggleShowCircle"/>
                <el-checkbox v-model="checkedPointTriangular" label="三角形" size="large" @change="toggleShowTriangular"/>
            </div>
            <div>
                <el-checkbox v-model="checkedPointSquare" label="正方形" size="large" @change="toggleShowSquare"/>
                <el-checkbox v-model="checkedPointPentagram" label="五角形" size="large" @change="toggleShowPentagram"/>
            </div>
            <div>
                <!-- <el-checkbox v-model="checkedPointArrowhead" label="箭头" size="large" @change="toggleShowArrowhead"/> -->
                <!-- <el-checkbox v-model="checkedPointPentagram" label="五角形" size="large" @change="toggleShowPentagram"/> -->
            </div>
        </div>
        <div id="ssss" class="style-container">
            <h5>图标</h5>
            <div>
                <el-checkbox v-model="checkedPointIconFlag" label="旗帜" size="large" @change="toggleShowIconFlag"/>
                <el-checkbox v-model="checkedPointIconLocation" label="定位" size="large" @change="toggleShowIconLocation"/>
            </div>
        </div>
        <div id="ssss" class="style-container">
            <h5>线样式</h5>
            <el-checkbox v-model="checkedLine" label="线" size="large" @change="toggleShowLine"/>
        </div>
      </el-aside>
      <el-main>
        <div id="zoom-level-now">当前级别：{{zoom}}</div>
        <div id="map" class="map"></div>
      </el-main>
    </el-container>
    
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
.el-container {
    height: 100%;
}
.el-main {
    padding: 0;
}
.style-container {
    height: 33.3%;
}
</style>