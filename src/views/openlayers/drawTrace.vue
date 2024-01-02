<script setup>
import { onMounted, ref } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Draw, Snap } from 'ol/interaction'
// import { Type } from 'ol/geom/Geometry'
import { GeoJSON } from 'ol/format'
import { LineString } from 'ol/geom'

let map = new Map({})
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})
// 基础图层，图层的要素将被捕捉
const baseLayer = new VectorLayer({
    source: new VectorSource({
        format: new GeoJSON(),
        url: '/gisdata/370100.geojson',
    }),
    style: {
        'fill-color': 'rgba(125, 125, 125, 0.3)',
        'stroke-color': 'rgba(255, 0, 0, 0.9)',
        'stroke-width': 0.8,
    },
})
const baseLayer2 = new VectorLayer({
    source: new VectorSource({
        format: new GeoJSON(),
        url: '/gisdata/371400.geojson',
    }),
    style: {
        'fill-color': 'rgba(255, 125, 125, 0.3)',
        'stroke-color': 'rgba(255, 0, 0, 0.9)',
        'stroke-width': 0.8,
    },
})
// 绘制图层
const drawLayer = new VectorLayer({
    source: new VectorSource(),
    style: {
        'stroke-color': 'rgba(100, 255, 0, 1)',
        'stroke-width': 2,
        'fill-color': 'rgba(100, 255, 0, 0.3)',
    },
})

// 注册周期钩子
onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, baseLayer, baseLayer2, drawLayer],
        target: 'map',
        view: new View({
            center: [117, 37],
            zoom: 10,
            projection: 'EPSG:4326',
        })
    })
    addInteractions()
})

// 定义地图交互
const snapInteraction = new Snap({
    source: baseLayer.getSource()
    // source: [baseLayer.getSource() as VectorSource, baseLayer2.getSource() as VectorSource]
})
// const modify = new Modify({ source: sourceDraw })
let drawInteraction

// 选择框数据
let isModify = ref(false)
const selectDrawType = ref('Polygon')
const selectDrawOptions = [{
    value: 'LineString',
    label: '线',
},
{
    value: 'Polygon',
    label: '面',
}]


// 添加交互
const addInteractions = () => {
    drawInteraction = new Draw({
        source: drawLayer.getSource(),
        type: selectDrawType.value,
        trace: true,
        traceSource: baseLayer.getSource(),
        style: {
            'stroke-color': 'rgba(10, 255, 255, 0.5)',
            'stroke-width': 1.5,
            'fill-color': 'rgba(10, 255, 255, 0.25)',
            'circle-radius': 5,
            'circle-fill-color': 'rgba(10, 255, 255, 1)',
        },
        condition: function (event) {
            if (event.originalEvent.button == 0) {
                return true
            } else if (event.originalEvent.button == 2) {
                drawInteraction.removeLastPoint()
                return false
            } else {
                return true
            }
        },
        geometryFunction: function(coordinates, geometry) {
            if (!geometry) {
                geometry = new LineString([])
            }
            var startPoint = coordinates[0]
            var endPoint = coordinates[1]
            var arcPoints = [] // 用于存储圆弧上的点
            var center = [(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2] // 圆弧的中心点
            var radius = Math.sqrt(Math.pow(endPoint[0] - startPoint[0], 2) + Math.pow(endPoint[1] - startPoint[1], 2)) / 2 // 圆弧的半径
            var startAngle = Math.atan2(startPoint[1] - center[1], startPoint[0] - center[0]) // 圆弧的起始角度
            var endAngle = Math.atan2(endPoint[1] - center[1], endPoint[0] - center[0]) // 圆弧的终止角度
            var angle = endAngle - startAngle // 圆弧的角度

            // 将圆弧上的点添加到arcPoints数组中
            for (var i = 0; i <= 100; i++) {
                var angleStep = startAngle + angle * (i / 100)
                var x = center[0] + radius * Math.cos(angleStep)
                var y = center[1] + radius * Math.sin(angleStep)
                arcPoints.push([x, y])
            }

            geometry.setCoordinates(arcPoints) // 设置线几何对象的坐标为圆弧上的点
            return geometry
        }
    })
    map.addInteraction(drawInteraction)
    map.addInteraction(snapInteraction)
}
// 修改
const addInteractionModify = () => {
    // if (isModify.value) {
    //     map.removeInteraction(draw)
    //     map.addInteraction(modify)
    // } else {
    //     map.removeInteraction(modify)
    // }
    // isModify.value = !isModify.value
}
// 选择框改变事件
function selectChange() {
    map.removeInteraction(drawInteraction)
    map.removeInteraction(snapInteraction)
    addInteractions()
}
// 清空绘制图层
const clearDrawLayer = () => {
    drawLayer.getSource()?.clear()
}
// 回退
const backPrePoint = () => {
    drawInteraction.removeLastPoint()
}
</script>

<template>
    <div id="map" class="map"></div>
    <el-card class="box-card">
        <label for="type">图形类型&nbsp;</label>
        <el-select v-model="selectDrawType" class="m-2" placeholder="选择绘制类型" v-on:change="selectChange">
            <el-option v-for="item in selectDrawOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="clearDrawLayer">清空图层</el-button>
        <el-button type="primary" @click="backPrePoint">回退上一个点</el-button>
        <el-button :type="isModify ? '' : 'primary'" @click="addInteractionModify">修改</el-button>
    </el-card>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}

.box-card {
    position: absolute;
    left: 40px;
    top: 20px;
}

.el-button {
    margin: 0 10px;
}
</style>