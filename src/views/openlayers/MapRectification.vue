<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { onMounted, reactive, ref } from 'vue'
import { OSM } from 'ol/source'
import gcjMecator from '@/utils/gcj-trans'

// 定义map
let map = new Map({})
// 高德瓦片
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})
const gaodeRectificationLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        projection: gcjMecator,
    }),
    visible: false
})
// 天地图
const tileLayerTianDiTu = new TileLayer({
    source: new XYZ({
        url: 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=f24f84bfee752c6525c176e9e1505b52'
    }),
    visible: false
})
const tileLayerTianDiTuZhuJi = new TileLayer({
    source: new XYZ({
        url: 'http://t{0-7}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=f24f84bfee752c6525c176e9e1505b52'
    }),
    visible: false
})
// OSM瓦片
const osmLayer = new TileLayer({
    source: new OSM(),
    visible: false
})
// 图层数组
const mapLayers = reactive([{
    id: 0,
    name: '高德底图',
    layer: gaodeTileLayer,
    check: true
}, {
    id: 1,
    name: '高德纠偏',
    layer: gaodeRectificationLayer,
    check: false
}, {
    id: 2,
    name: '天地图',
    layer: tileLayerTianDiTu,
    check: false
}, {
    id: 3,
    name: '天地图注记',
    layer: tileLayerTianDiTuZhuJi,
    check: false
}, {
    id: 4,
    name: 'OSM底图',
    layer: osmLayer,
    check: false
}])

onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, gaodeRectificationLayer, tileLayerTianDiTu, tileLayerTianDiTuZhuJi, osmLayer],
        target: 'map',
        view: new View({
            center: [117, 37],
            zoom: 10,
            projection: 'EPSG:4326',
        })
    })
})
// 控制图层显隐
const checkLayer = (index: number) => {
    if (mapLayers[index].check === false) {
        mapLayers[index].layer.setVisible(false)
    } else {
        mapLayers[index].layer.setVisible(true)
    }
}
// 坐标类型
const coordinateInput = ref('')
const coordinateType = ref(['WGS84'])
const coordinateTextarea = ref('')
// 选择坐标类型
const statusChange = () => {
    if (coordinateType.value.length > 1) {
        coordinateType.value.splice(0, 1)
    }
}

</script>

<template>
    <el-card class="layer-card">
        <h3>图层管理</h3>
        <el-checkbox v-for="(item) in mapLayers" :key="item.id" v-model="item.check" :label="item.name" size="large"
            @change="checkLayer(item.id)" />
    </el-card>
    <el-card class="coordinate-card">
        <h3>坐标转换</h3>
        <span>输入坐标</span>
        <el-input v-model="coordinateTextarea" :rows="2" type="textarea" />
        <span>选择坐标类型</span>
        <el-checkbox-group v-model="coordinateType" @change="statusChange">
            <el-checkbox label="WGS84"></el-checkbox>
            <el-checkbox label="GCJ02"></el-checkbox>
            <el-checkbox label="BD09"></el-checkbox>
        </el-checkbox-group>
        <span>输出坐标</span>
        <el-input v-model="coordinateTextarea" :rows="8" type="textarea" />
    </el-card>
    <div id="map" class="map">
    </div>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}

#mapMenu {
    z-index: 1;
    position: absolute;
    top: 40px;
    left: 50px;
}

.layer-card {
    position: absolute;
    top: 20px;
    left: 50px;
    z-index: 10;
    width: 200px;
}

.coordinate-card {
    position: absolute;
    top: 20px;
    left: 300px;
    z-index: 10;
    width: 200px;
}

.el-checkbox {
    display: flex;
    margin-right: 0;
}
</style>