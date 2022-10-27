<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Draw, Interaction, Modify, Snap } from 'ol/interaction'
import { GeoJSON, WKT, EsriJSON, KML } from 'ol/format'
import { Type } from 'ol/geom/Geometry'
import { onMounted, ref } from 'vue'
import { saveAs } from 'file-saver'

let map = new Map({})
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})

const sourceDraw = new VectorSource()
const vectorDraw = new VectorLayer({
    source: sourceDraw,
})

// 注册周期钩子
onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, vectorDraw],
        target: 'map',
        view: new View({
            center: [117, 37],
            zoom: 10,
            projection: 'EPSG:4326',
        })
    })
    addInteractions()
})
// 是否使用捕捉功能
let isSnap = ref(false)
// 选择框数据
let isModify = ref(false)
const selectDrawType = ref('Point')
const selectDrawOptions = [{
    value: 'Point',
    label: '点',
},
{
    value: 'LineString',
    label: '线',
},
{
    value: 'Polygon',
    label: '面',
},
{
    value: 'Circle',
    label: '圆',
}]
// 抽屉相关参数
const isShowDrawer = ref(false)
const directionDrawer = ref('rtl')
const activeNameCollapse = ref('1')
const geojsonDrawTextarea = ref('')
const wktDrawTextarea = ref('')
const esrijsonDrawTextarea = ref('')
const kmlDrawTextarea = ref('')

const modify = new Modify({ source: sourceDraw })
let draw: Interaction, snap: Interaction
// 添加交互
const addInteractions = () => {
    draw = new Draw({
        source: sourceDraw,
        type: selectDrawType.value as Type,
    })
    map.addInteraction(draw)
    // 必须在添加“Modify”和“Draw”交互之后添加Snap交互
    snapSwitch()
}
// 修改
const addInteractionModify = () => {
    if (isModify.value) {
        map.removeInteraction(draw)
        map.addInteraction(modify)
    } else {
        map.removeInteraction(modify)
    }
    isModify.value = !isModify.value
}
// 清空绘制图层
function clearDrawLayer(){
    sourceDraw.clear()
}
// 选择框改变事件
function selectChange() {
    map.removeInteraction(draw)
    map.removeInteraction(snap)
    addInteractions()
}
// 捕捉功能开关函数
const snapSwitch = () => {
    if (isSnap.value) {
        snap = new Snap({ source: sourceDraw })
        map.addInteraction(snap)
    } else {
        map.removeInteraction(snap)
    }
}
// 抽屉开关
function openDrawe() {
    isShowDrawer.value = true
    const featuresDraw = sourceDraw.getFeatures()
    const geoJsonDraw = new GeoJSON().writeFeatures(featuresDraw)
    const wktDraw = new WKT().writeFeatures(featuresDraw)
    const esriJsonDraw = new EsriJSON().writeFeatures(featuresDraw)
    const kmlDraw = new KML().writeFeatures(featuresDraw)
    geojsonDrawTextarea.value = geoJsonDraw
    wktDrawTextarea.value = wktDraw
    esrijsonDrawTextarea.value = esriJsonDraw
    kmlDrawTextarea.value = kmlDraw
}
function closeDrawer() {
    isShowDrawer.value = false
}
// 下载数据
function downloadFile() {
    var file = new File([geojsonDrawTextarea.value], 'GeoJsonDraw.geojson', {type: 'text/plain;charset=utf-8'})
    saveAs(file)
}
</script>

<template>
    <div id="map" class="map"></div>
    <el-card class="box-card">
        <label for="type">图形类型&nbsp;</label>
        <el-select v-model="selectDrawType" class="m-2" placeholder="选择绘制类型" v-on:change="selectChange">
            <el-option v-for="item in selectDrawOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-switch v-model="isSnap" @change="snapSwitch" /><span>捕捉功能</span>
        <el-button :type="isModify ? '' : 'primary'" @click="addInteractionModify">修改</el-button>
        <el-button type="primary" @click="clearDrawLayer">清空图层</el-button>
        <el-button type="primary" style="margin-left: 16px" @click="openDrawe">打开数据列表</el-button>
    </el-card>
    <el-drawer v-model="isShowDrawer" :direction="directionDrawer">
        <template #title>
            <h4>数据列表</h4>
        </template>
        <template #default>
            <el-collapse v-model="activeNameCollapse" accordion>
                <el-collapse-item title="GeoJson" name="1">
                    <el-input v-model="geojsonDrawTextarea" :autosize="{ minRows: 8, maxRows: 16 }" type="textarea" />
                </el-collapse-item>
                <el-collapse-item title="WKT" name="2">
                    <el-input v-model="wktDrawTextarea" :autosize="{ minRows: 8, maxRows: 8 }" type="textarea" />
                </el-collapse-item>
                <el-collapse-item title="EsriJson" name="3">
                    <el-input v-model="esrijsonDrawTextarea" :autosize="{ minRows: 8, maxRows: 16 }" type="textarea" />
                </el-collapse-item>
                <el-collapse-item title="GML" name="4">
                    <el-input v-model="kmlDrawTextarea" :autosize="{ minRows: 8, maxRows: 16 }" type="textarea" />
                </el-collapse-item>
            </el-collapse>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="closeDrawer">关闭</el-button>
                <el-button type="primary" @click="downloadFile">下载(.geojson)</el-button>
            </div>
        </template>
    </el-drawer>
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
    /* width: 150px; */
}

.el-button {
    margin: 0 10px;
}

.el-switch {
    margin: 0 3px 0 10px;
}
</style>