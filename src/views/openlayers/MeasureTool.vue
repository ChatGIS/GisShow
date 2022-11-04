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
import { LineString, Polygon } from 'ol/geom'
import { Draw } from 'ol/interaction'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import Overlay from 'ol/Overlay'
import { DrawEvent } from 'ol/interaction/Draw'
import { EventsKey } from 'ol/events'
import { getLength, getArea } from 'ol/sphere'
import Geometry, { Type } from 'ol/geom/Geometry'
import { unByKey } from 'ol/Observable'

// 定义map
let map: Map
const mapObj = {
    center: [117.024, 36.676],
    zoom: 15
}

onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, layerDraw],
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
const isDrawing = ref(true)  // 是否在绘制过程中
let sketch: Feature  // 当前画的要素
let draw: Draw  // 绘制交互
let listener: EventsKey  // 监听事件
let measureTooltipElement: HTMLElement
let measureTooltip: Overlay  // 测量提示框
let helpTooltipElement: HTMLElement
let helpTooltip: Overlay
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

    createMeasureTooltip()
    createHelpTooltip()
    draw.on('drawstart', (evt: DrawEvent) => {
        isDrawing.value = true
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
        isDrawing.value = false
        measureTooltip.setOffset([0, -7])
        // unset sketch
        sketch = new Feature(new Geometry)
        // unset tooltip so that a new one can be created
        measureTooltipElement.innerHTML = ''
        createMeasureTooltip()
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
    const length = getLength(line)
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
    const area = getArea(polygon)
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
</script>

<template>
    <div id="map" class="map"></div>
    <el-card id="choose-card" class="measure-radio" @change="changeTypeMeasure">
        <el-radio-group v-model="typeMeasure">
        <el-radio :label="1">长度测量</el-radio>
        <el-radio :label="2">面积测量</el-radio>
    </el-radio-group>
    </el-card>
    <div id="element-measure-overlay" :class="[isDrawing ? 'ol-tooltip ol-tooltip-static' : 'ol-tooltip-measure']"></div>
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