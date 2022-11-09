<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource, XYZ } from 'ol/source'
import View from 'ol/View'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import MapBrowserEvent from 'ol/MapBrowserEvent'
import Feature from 'ol/Feature'
import { LineString, Point, Polygon } from 'ol/geom'
import { Draw } from 'ol/interaction'
import { Circle as CircleStyle, Fill, Icon, RegularShape, Stroke, Style, Text } from 'ol/style'
import Overlay from 'ol/Overlay'
import { DrawEvent } from 'ol/interaction/Draw'
import { EventsKey } from 'ol/events'
import { getLength, getArea } from 'ol/sphere'
import Geometry, { Type } from 'ol/geom/Geometry'
import { unByKey } from 'ol/Observable'
import getAssetsFile from '@/utils/sys-use'

// 定义map
let map: Map
const mapObj = {
    center: [117.024, 36.676],
    zoom: 15
}

onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, layerDraw, layerLocate],
        target: 'map',
        view: new View({
            center: mapObj.center,
            zoom: mapObj.zoom,
            projection: 'EPSG:4326',
        })
    })
    // 添加鼠标位置
    map.addControl(controlMousePosition)
    // 
    map.on('pointermove', pointMoveHandler)
    changeTypeMeasure()
})

const typeMeasure = ref(1)  // 测量类型
let sketch: Feature  // 当前画的要素
let draw: Draw  // 绘制交互
let listener: EventsKey  // 监听事件
let measureTooltipElement: HTMLElement
let measureTooltip: Overlay  // 测量提示框
let helpTooltipElement: HTMLElement
let helpTooltip: Overlay
let inputCoorFirstPoint = ref('')
let inputCoorSecondPoint = ref('')
let lengthTwoPoint = ref('')
// 高德瓦片
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})
// 绘制图层
const sourceDraw = new VectorSource()
const layerDraw = new VectorLayer({
    source: sourceDraw,
    style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
    }
})
// 定位图层
const sourceLocate = new VectorSource()
const layerLocate = new VectorLayer({
    source: sourceLocate
})

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position') as HTMLElement
})

// 添加画图交互
const addDrawInteraction = (typeMea: Type) => {
    draw = new Draw({
        source: sourceDraw,
        type: typeMea,
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2,
            }),
            image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.7)',
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
            }),
        }),
    })
    map.addInteraction(draw)

    
    createHelpTooltip()
    draw.on('drawstart', (evt: DrawEvent) => {
        createMeasureTooltip()
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
        sketch = evt.feature
        let tooltipCoord = evt.target.finishCoordinate_
        listener = sketch.getGeometry()?.on('change', (evt) => {
            const geom = evt.target
            let output = ''
            if (geom instanceof Polygon) {
                output = formatArea(geom)
                tooltipCoord = geom.getInteriorPoint().getCoordinates()
            } else if (geom instanceof LineString) {
                output = formatLength(geom)
                tooltipCoord = geom.getLastCoordinate()
            }
            measureTooltipElement.innerHTML = output
            measureTooltip.setPosition(tooltipCoord)
        }) as EventsKey
    })
    draw.on('drawend', () => {
        measureTooltip.setOffset([0, -7])
        // unset sketch
        sketch = new Feature(new Geometry)
        // unset tooltip so that a new one can be created
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
        // createMeasureTooltip()
        unByKey(listener)
    })
}
// 创建实时测量值展示框
const createMeasureTooltip = () => {
    measureTooltipElement = document.getElementById('element-measure-overlay') as HTMLElement
    measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
        stopEvent: false,
        insertFirst: false,
    })
    map.addOverlay(measureTooltip)
}
// 创建帮助提示框
const createHelpTooltip = () => {
    // if (helpTooltipElement) {
    //     helpTooltipElement.parentNode.removeChild(helpTooltipElement)
    // }
    helpTooltipElement = document.getElementById('element-help-overlay') as HTMLElement
    helpTooltipElement.className = 'ol-tooltip hidden'
    helpTooltip = new Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
    })
    map.addOverlay(helpTooltip)
}
// 鼠标移动处理函数
const pointMoveHandler = (evt: MapBrowserEvent<UIEvent>) => {
    if (evt.dragging) {
        return
    }
    let helpMsg = '点击地图开始测量'
    if (sketch) {
        const geom = sketch.getGeometry()
        if (geom instanceof Polygon) {
            helpMsg = '单击继续，双击结束测量面积'
        } else if (geom instanceof LineString) {
            helpMsg = '单击继续，双击结束测量长度'
        }
    }
    helpTooltipElement.innerHTML = helpMsg
    helpTooltip.setPosition(evt.coordinate)

    // helpTooltipElement.classList.remove('hidden')
}
// 长度格式化
const formatLength = (line: LineString) => {
    const length = getLength(line, {
        projection: 'EPSG:4326'
    })
    let output
    if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
    } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm'
    }
    return output
}
// 面积格式化
const formatArea = (polygon: Polygon) => {
    const area = getArea(polygon, {
        projection: 'EPSG:4326'
    })
    let output
    if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
    }
    return output
}
// 测量类型变化
const changeTypeMeasure = () => {
    map.removeInteraction(draw)
    let type: Type = 'LineString'
    if(typeMeasure.value === 1){
        type = 'LineString'
    } else {
        type = 'Polygon'
    }
    addDrawInteraction(type)
}
// 两点计算距离，并展示在地图上
const getLengthAndShowOfTwoPoint = () => {
    // 计算距离，展示在输出框
    const arrFirstPoint = inputCoorFirstPoint.value.split(',').map(Number)
    const arrSecondPoint = inputCoorSecondPoint.value.split(',').map(Number)   
    const geomLineTwoPoint = new LineString([arrFirstPoint, arrSecondPoint])
    const length = formatLength(geomLineTwoPoint)
    lengthTwoPoint.value = length
    // 地图展示计算距离
    const segmentPoint = new Point(geomLineTwoPoint.getCoordinateAt(0.5))  // 获取线的中心点
    const featureSegmentPoint = new Feature(segmentPoint)
    const aLineStyle = lengthLabelStyle.clone()  // 克隆一个样式
    aLineStyle.getText().setText(length)  // 动态设置样式显示文字
    featureSegmentPoint.setStyle(aLineStyle)
    sourceLocate.addFeature(featureSegmentPoint)
    // 图层展示定位点和线
    const featureFirstPoint = new Feature(new Point(arrFirstPoint))
    const featureSecondPoint = new Feature(new Point(arrSecondPoint))
    const featureLine = new Feature(geomLineTwoPoint)
    featureFirstPoint.setStyle(styleLocateFirstPoint)
    featureSecondPoint.setStyle(styleLocateSecondPoint)
    sourceLocate.addFeature(featureFirstPoint)
    sourceLocate.addFeature(featureSecondPoint)
    sourceLocate.addFeature(featureLine)
    // 地图适配线，并缩小一级
    map.getView().fit(geomLineTwoPoint)
    map.getView().setZoom(map.getView().getZoom() as number - 1)
}

const styleLocateSecondPoint = new Style({
    image: new Icon({
        src: getAssetsFile('locate-blue.png'),
        size: [64, 64],
        offset: [-17, -5]
    }),
    text: new Text({
        text: '点2',
        font: '15px sans-serif',
        offsetX: -3,
        offsetY: -32,
        fill: new Fill({
            color: 'blue'
        })
    })
})
const styleLocateFirstPoint = new Style({
    image: new Icon({
        src: getAssetsFile('locate-green.png'),
        size: [64, 64],
        offset: [-17, -5]
    }),
    text: new Text({
        text: '点1',
        font: '15px sans-serif',
        offsetX: -3,
        offsetY: -32,
        fill: new Fill({
            color: 'green'
        })
    })
})
const lengthLabelStyle = new Style({
    text: new Text({
        font: '12px Calibri,sans-serif',
        fill: new Fill({
            color: 'rgba(255, 255, 255, 1)',
        }),
        backgroundFill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
        }),
        padding: [2, 2, 2, 2],
        textBaseline: 'bottom',
        offsetY: -12,
    }),
    image: new RegularShape({
        radius: 6,
        points: 3,
        angle: Math.PI,
        displacement: [0, 8],
        fill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
        }),
    }),
})
</script>

<template>
    <div id="map" class="map"></div>
    <el-card id="choose-card" class="measure-radio" @change="changeTypeMeasure">
        <el-radio-group v-model="typeMeasure">
        <el-radio :label="1">长度测量</el-radio>
        <el-radio :label="2">面积测量</el-radio>
    </el-radio-group>
    </el-card>
    <el-card id="point-card">
        <template #header>
            <span>输入两点坐标，输出两点距离</span>
        </template>
        <span>点1：</span>
        <el-input placeholder="输入格式如：112,37" v-model="inputCoorFirstPoint"></el-input>
        <el-button type="primary" circle />
        <br>
        <span>点2：</span>
        <el-input placeholder="输入格式如：112,37" v-model="inputCoorSecondPoint"></el-input><br>
        <el-button class="button" type="primary" @click="getLengthAndShowOfTwoPoint">输出</el-button>
        <el-input placeholder="输出结果" v-model="lengthTwoPoint"></el-input>
    </el-card>
    <div id="element-measure-overlay" class="ol-tooltip ol-tooltip-measure"></div>
    <div id="element-help-overlay"></div>
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

#choose-card {
    position: absolute;
    top: 10px;
    left: 50px;
    z-index: 10;
}
#point-card {
    position: absolute;
    top: 100px;
    left: 50px;
    z-index: 10;
}
#point-card .el-input{
    max-width: 150px;
    margin: 2px;
}
.ol-tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    opacity: 0.7;
    white-space: nowrap;
    font-size: 12px;
    cursor: default;
    user-select: none;
}

.ol-tooltip-measure {
    opacity: 1;
    font-weight: bold;
}

.ol-tooltip-static {
    background-color: #ffcc33;
    color: black;
    border: 1px solid white;
}
</style>