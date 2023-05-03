<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { Vector as VectorSource, XYZ } from 'ol/source'
import View from 'ol/View'
import { onMounted, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { Feature } from 'ol'
import { LineString, Point, Polygon } from 'ol/geom'
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
let checkedClassOnly = ref(false)
let checkedClassRange = ref(false)
let checkedPointTriangular = ref(false)
let checkedPointSquare = ref(false)
let checkedPointPentagram = ref(false)
let checkedPointIconFlag = ref(false)
let checkedPointIconLocation = ref(false)
let checkedLine = ref(false)
let checkedPolygon = ref(false)
let checkedLineClassOnly = ref(false)
let checkedLineClassRange = ref(false)
let checkedPolygonClassOnly = ref(false)
let checkedPolygonClassRange = ref(false)

onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, layerPolygon, layerLine, layerMultiPolygon, layerMultiLine, layerPoint],
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
})

// 高德瓦片
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})
// 要素图层
const sourcePoint = new VectorSource({})
const layerPoint = new Vector({
    source: sourcePoint
})  
const sourceLine = new VectorSource({})
const layerLine = new Vector({
    source: sourceLine
})
const sourcePolygon = new VectorSource({})
const layerPolygon = new Vector({
    source: sourcePolygon
})
const sourceMultiLine = new VectorSource({})
const layerMultiLine = new Vector({
    source: sourceMultiLine
})
const sourceMultiPolygon = new VectorSource({})
const layerMultiPolygon = new Vector({
    source: sourceMultiPolygon
})
// 图层对象
const layerPointObj = {
    layer: layerPoint,
    GeometryType: 'POINT',
    settingLabel: {},
    settingStyle: {
        show: {
            styleType: 1,
            one: {

            },
            only: [{
                displayType: 'POINTSTYLE',
                shapeCode: 1,
                shapeSize: 10,
                opacity: 50,
                fillColor: '#FF0000',
                strokeColor: '#00FF00',
                strokeWidth: 2,
                filterColumn: 'name',
                filterValue: '1'
            }, {
                displayType: 'POINTSTYLE',
                shapeCode: 2,
                shapeSize: 10,
                opacity: 50,
                fillColor: '#FF0000',
                strokeColor: '#00FF00',
                strokeWidth: 2,
                filterColumn: 'name',
                filterValue: '2'
            },{
                displayType: 'POINTSTYLE',
                shapeCode: 3,
                shapeSize: 10,
                opacity: 50,
                fillColor: '#FF0000',
                strokeColor: '#00FF00',
                strokeWidth: 2,
                filterColumn: 'name',
                filterValue: '3'
            },{
                displayType: 'POINTSTYLE',
                shapeCode: 4,
                shapeSize: 10,
                opacity: 50,
                fillColor: '#FF0000',
                strokeColor: '#00FF00',
                strokeWidth: 2,
                filterColumn: 'name',
                filterValue: '4'
            },{
                displayType: 'BITMAPSTYLE',
                opacity: 50,
                width: 30,
                height: 30,
                xOffset: 30,
                yOffset: 30,
                srcIcon: IconFlag,
                filterColumn: 'name',
                filterValue: '5'
            },{
                displayType: 'BITMAPSTYLE',
                opacity: 100,
                width: 30,
                height: 30,
                xOffset: 0,
                yOffset: 0,
                srcIcon: IconLocation,
                filterColumn: 'name',
                filterValue: '6'
            }],
            range: [{
                displayType: 'POINTSTYLE',
                shapeCode: 1,
                shapeSize: 10,
                opacity: 50,
                fillColor: '#FF0000',
                strokeColor: '#00FF00',
                strokeWidth: 2,
                filterColumn: 'name',
                filterMin: '0',
                filterMax: '5'
            },{
                displayType: 'BITMAPSTYLE',
                opacity: 100,
                width: 30,
                height: 30,
                xOffset: 0,
                yOffset: 0,
                srcIcon: IconLocation,
                filterColumn: 'name',
                filterMin: '5',
                filterMax: '10'
            }]
        },
    },
}
const layerMultiPolygonObj = {
    layer: layerMultiPolygon,
    GeometryType: 'POLYGON',
    settingLabel: {},
    settingStyle: {
        show: {
            styleType: 2,
            one: {
                displayType: 'POLYGONSTYLE',
                opacity: 50,
                fillColor: '#000000',
                strokeColor: '#000000',
                strokeWidth: 5,
            },
            only: [{
                displayType: 'POLYGONSTYLE',
                opacity: 80,
                fillColor: '#FF0000',
                strokeColor: '#000000',
                strokeWidth: 5,
                filterColumn: 'name',
                filterValue: '1'
            },{
                displayType: 'POLYGONSTYLE',
                opacity: 80,
                fillColor: '#00FF00',
                strokeColor: '#000000',
                strokeWidth: 5,
                filterColumn: 'name',
                filterValue: '4'
            }],
            range: [{
                displayType: 'POLYGONSTYLE',
                opacity: 80,
                fillColor: '#FF0000',
                strokeColor: '#000000',
                strokeWidth: 5,
                filterColumn: 'name',
                filterMin: 0,
                filterMax: 3,
            },{
                displayType: 'POLYGONSTYLE',
                opacity: 80,
                fillColor: '#FFFF00',
                strokeColor: '#000000',
                strokeWidth: 5,
                filterColumn: 'type',
                filterValue: '1',
                filterMin: 3,
                filterMax: 6,
            },{
                displayType: 'POLYGONSTYLE',
                opacity: 80,
                fillColor: '#00FF00',
                strokeColor: '#000000',
                strokeWidth: 5,
                filterColumn: 'type',
                filterMin: 6,
                filterMax: 8,
            }]
        }
    }
}
const layerMultiLineObj = {
    layer: layerMultiLine,
    GeometryType: 'LINE',
    settingLabel: {},
    settingStyle: {
        show: {
            styleType: 2,
            one: {
                displayType: 'LINESTYLE',
                opacity: 50,
                fillColor: '#00000',
                strokeColor: '#000000',
                strokeWidth: 5,
                width: 20,
            },
            only: [{
                displayType: 'LINESTYLE',
                opacity: 80,
                fillColor: '#FF0000',
                strokeColor: '#000000',
                strokeWidth: 5,
                width: 20,
                filterColumn: 'type',
                filterValue: '0'
            },{
                displayType: 'LINESTYLE',
                opacity: 80,
                fillColor: '#FFFF00',
                strokeColor: '#000000',
                strokeWidth: 5,
                width: 20,
                filterColumn: 'type',
                filterValue: '1'
            }],
            range: [{
                displayType: 'LINESTYLE',
                opacity: 80,
                fillColor: '#FF0000',
                strokeColor: '#000000',
                strokeWidth: 5,
                width: 20,
                filterColumn: 'name',
                filterMin: 0,
                filterMax: 3,
            },{
                displayType: 'LINESTYLE',
                opacity: 80,
                fillColor: '#FFFF00',
                strokeColor: '#000000',
                strokeWidth: 5,
                width: 20,
                filterColumn: 'type',
                filterValue: '1',
                filterMin: 3,
                filterMax: 6,
            },{
                displayType: 'LINESTYLE',
                opacity: 80,
                fillColor: '#00FF00',
                strokeColor: '#000000',
                strokeWidth: 5,
                width: 20,
                filterColumn: 'type',
                filterMin: 6,
                filterMax: 8,
            }]
        }
    }
}
// 初始化图层数据
const initLayerData = () => {
    const count = 10
    const points = []
    const polygonData = []
    const polygonDataLine = []
    for(let i = 0; i < count; i++) {
        const operator1 = Math.random() > 0.5 ? '+' : '-'
        const operator2 = Math.random() > 0.5 ? '+' : '-'
        const lon = eval('mapObj.center[0]' + operator1 + '0.1 * Math.random() * Math.random()')
        const lat = eval('mapObj.center[1]' + operator2 + '0.05 * Math.random() * Math.random()')
        const feature = new Feature(new Point([lon, lat]))
        feature.set('name', i)
        sourcePoint.addFeature(feature)

        points.push([lon, lat])
        if(i < 3) {
            polygonDataLine.push([lon, lat])
        }
    }
    sourceLine.addFeature(new Feature(new LineString(points)))

    polygonData.push(polygonDataLine)
    sourcePolygon.addFeature(new Feature(new Polygon(polygonData)))

    // 多线数据
    for(let i = 1; i < points.length; i++) {
        const aLine = [points[i], points[i - 1]]
        const aLineFeature = new Feature(new LineString(aLine))
        aLineFeature.set('type', i % 3)
        aLineFeature.set('name', i)
        sourceMultiLine.addFeature(aLineFeature)
    }
    // 多面数据
    for(let i = 1; i < points.length; i = i + 3) {
        const aPolygon = []
        if(points[i + 2]) {
            aPolygon.push([points[i], points[i + 1], points[i + 2], points[i]])
        }
        const aPolygonFeature = new Feature(new Polygon(aPolygon))
        aPolygonFeature.set('name', i)
        sourceMultiPolygon.addFeature(aPolygonFeature)
    }
}

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position') as HTMLElement
})

// 标签设置项
const settingLabel = {
    columnName: 'name',
    fontType: 'sans-serif',
    fontSize: 20,
    textColor: '#000000',
    textOpacity: 80,
    textOffsetX: 20,
    textOffsetY: 20,
}


// 圆形
const toggleShowCircle = () => {
    layerPointObj.settingStyle.show.one = {
        displayType: 'POINTSTYLE',
        opacity: 80,
        shapeCode: 1,
        shapeSize: 30,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
    }
    layerPointObj.settingLabel = settingLabel
    layerPointObj.settingStyle.show.styleType = 1
    StyleSetting.setLayerStyle(layerPointObj)
}
// 三角形
const toggleShowTriangular = () => {
    layerPointObj.settingStyle.show.one = {
        displayType: 'POINTSTYLE',
        opacity: 80,
        shapeCode: 2,
        shapeSize: 30,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
    }
    layerPointObj.settingLabel = settingLabel
    layerPointObj.settingStyle.show.styleType = 1
    StyleSetting.setLayerStyle(layerPointObj)
}
// 正方形
const toggleShowSquare = () => {
    layerPointObj.settingStyle.show.one = {
        displayType: 'POINTSTYLE',
        opacity: 80,
        shapeCode: 3,
        shapeSize: 30,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
    }
    layerPointObj.settingLabel = settingLabel
    layerPointObj.settingStyle.show.styleType = 1
    StyleSetting.setLayerStyle(layerPointObj)
}
// 五角星
const toggleShowPentagram = () => {
    layerPointObj.settingStyle.show.one = {
        displayType: 'POINTSTYLE',
        opacity: 80,
        shapeCode: 4,
        shapeSize: 40,
        fillColor: '#FF0000',
        strokeColor: '#00FF00',
        strokeWidth: 2,
    }
    layerPointObj.settingLabel = settingLabel
    layerPointObj.settingStyle.show.styleType = 1
    StyleSetting.setLayerStyle(layerPointObj)
}

// 旗帜图标
const toggleShowIconFlag = () => {
    layerPointObj.settingStyle.show.one = {
        displayType: 'BITMAPSTYLE',
        opacity: 80,
        width: 20,
        height: 20,
        xOffset: 10,
        yOffset: 10,
        srcIcon: IconFlag
    }
    layerPointObj.settingLabel = settingLabel
    layerPointObj.settingStyle.show.styleType = 1
    StyleSetting.setLayerStyle(layerPointObj)
}
// 定位图标
const toggleShowIconLocation = () => {    
    layerPointObj.settingStyle.show.one = {
        displayType: 'BITMAPSTYLE',
        opacity: 80,
        width: 20,
        height: 20,
        xOffset: 10,
        yOffset: 10,
        srcIcon: IconLocation
    }
    layerPointObj.settingLabel = settingLabel
    layerPointObj.settingStyle.show.styleType = 1
    StyleSetting.setLayerStyle(layerPointObj)
}
// 线样式
const toggleShowLine = () => {
    layerMultiLineObj.settingLabel = settingLabel
    layerMultiLineObj.settingStyle.show.styleType = 1
    StyleSetting.setLayerStyle(layerMultiLineObj)
}
// 面样式
const toggleShowPolygon = () => {
    layerMultiPolygonObj.settingLabel = settingLabel
    layerMultiPolygonObj.settingStyle.show.styleType = 1
    StyleSetting.setLayerStyle(layerMultiPolygonObj)
}
// 点唯一值
const togglePointOnly = () => {
    layerPointObj.settingLabel = settingLabel
    layerPointObj.settingStyle.show.styleType = 2
    StyleSetting.setLayerStyle(layerPointObj)
}
// 点范围
const togglePointRange = () => {
    layerPointObj.settingLabel = settingLabel
    layerPointObj.settingStyle.show.styleType = 3
    StyleSetting.setLayerStyle(layerPointObj)
}
// 线唯一值
const toggleLineOnly = () => {
    layerMultiLineObj.settingLabel = settingLabel
    layerMultiLineObj.settingStyle.show.styleType = 2
    StyleSetting.setLayerStyle(layerMultiLineObj)
}
// 线范围值
const toggleLineRange = () => {
    layerMultiLineObj.settingLabel = settingLabel
    layerMultiLineObj.settingStyle.show.styleType = 3 
    StyleSetting.setLayerStyle(layerMultiLineObj)
}
// 面唯一值
const togglePolygonOnly = () => {
    layerMultiPolygonObj.settingLabel = settingLabel
    layerMultiPolygonObj.settingStyle.show.styleType = 2
    StyleSetting.setLayerStyle(layerMultiPolygonObj)
}
// 面范围值
const togglePolygonRange = () => {
    layerMultiLineObj.settingLabel = settingLabel
    layerMultiPolygonObj.settingStyle.show.styleType = 3 
    StyleSetting.setLayerStyle(layerMultiPolygonObj)
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
        <div id="ssss" class="style-container">
            <h5>面样式</h5>
            <el-checkbox v-model="checkedPolygon" label="面" size="large" @change="toggleShowPolygon"/>
        </div>
        <div id="ssss" class="style-container">
            <h5>分类展示</h5>
            <el-checkbox v-model="checkedClassOnly" label="点（唯一值）" size="large" @change="togglePointOnly"/>
            <el-checkbox v-model="checkedClassRange" label="点（范围值）" size="large" @change="togglePointRange"/>
            <el-checkbox v-model="checkedLineClassOnly" label="线（唯一值）" size="large" @change="toggleLineOnly"/>
            <el-checkbox v-model="checkedLineClassRange" label="线（范围值）" size="large" @change="toggleLineRange"/>
            <el-checkbox v-model="checkedPolygonClassOnly" label="面（唯一值）" size="large" @change="togglePolygonOnly"/>
            <el-checkbox v-model="checkedPolygonClassRange" label="面（范围值）" size="large" @change="togglePolygonRange"/>
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
    height: 16%;
}
</style>