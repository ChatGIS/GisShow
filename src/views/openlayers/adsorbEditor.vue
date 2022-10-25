<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import {XYZ, Vector as VectorSource} from 'ol/source'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {Draw, Interaction, Modify, Snap} from 'ol/interaction'
import { onMounted, ref } from 'vue'

let map = new Map({})
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url:'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
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

const modify = new Modify({source: sourceDraw})
let draw: Interaction, snap: Interaction
// 添加交互
const addInteractions = () => {
    draw = new Draw({
        source: sourceDraw,
        type: selectDrawType.value,
    })
    map.addInteraction(draw)
    // 必须在添加“Modify”和“Draw”交互之后添加Snap交互
    snapSwitch()
}
// 修改
const addInteractionModify = () => {
    if(isModify.value){
        map.removeInteraction(draw)
        map.addInteraction(modify)
    } else {
        map.removeInteraction(modify)
    }
    isModify.value = !isModify.value
}
// 选择框改变事件
function selectChange(){
    map.removeInteraction(draw)
    map.removeInteraction(snap)
    addInteractions()
}
// 捕捉功能开关函数
const snapSwitch = () => {
    if(isSnap.value){
        snap = new Snap({source: sourceDraw})
        map.addInteraction(snap)
    } else {
        map.removeInteraction(snap)
    }
}
</script>

<template>
    <div id="map" class="map"></div>
    <el-card class="box-card">
            <label for="type">图形类型&nbsp;</label>
            <el-select v-model="selectDrawType" class="m-2" placeholder="选择绘制类型" v-on:change="selectChange">
                <el-option
                v-for="item in selectDrawOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                />
            </el-select>
            <el-switch v-model="isSnap" @change="snapSwitch"/><span>捕捉功能</span>
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
    left: 30px;
    top: 100px;
    width: 150px;
}
</style>