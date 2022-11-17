<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { onMounted, reactive, ref } from 'vue'
import { OSM } from 'ol/source'
import { MousePosition } from 'ol/control'
import gcjMecator from '@/utils/gcj-trans'
import keyJson from '@/assets/private/private.json'
import transCoor from '@/utils/trans-coor'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { createStringXY, Coordinate } from 'ol/coordinate'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { Icon, Text, Style, Fill } from 'ol/style'
import getAssetsFile from '@/utils/sys-use'

// 定义map
let map = new Map({})
const mapObj = {
    center: [117.024, 36.676],
    zoom: 16
}
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
        url: 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + keyJson.keyTianditu
    }),
    visible: false
})
const tileLayerTianDiTuZhuJi = new TileLayer({
    source: new XYZ({
        url: 'http://t{0-7}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + keyJson.keyTianditu
    }),
    visible: false
})
// OSM瓦片
const osmLayer = new TileLayer({
    source: new OSM(),
    visible: false
})

// 定位图层
const locateSource = new VectorSource({})
const locateLayer = new VectorLayer({
    source: locateSource,
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
    id: 4,
    name: '天地图注记',
    layer: tileLayerTianDiTuZhuJi,
    check: false
}, {
    id: 5,
    name: 'OSM底图',
    layer: osmLayer,
    check: false
}])
// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position') as HTMLElement
})

onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, gaodeRectificationLayer, tileLayerTianDiTu, tileLayerTianDiTuZhuJi, osmLayer, locateLayer],
        target: 'map',
        view: new View({
            center: mapObj.center,
            zoom: mapObj.zoom,
            projection: 'EPSG:4326',
        })
    })
    // 添加鼠标位置
    map.addControl(controlMousePosition)
    // 坐标拾取
    map.on('click', evt => {
        coordinateInput.value = evt.coordinate[0] + ',' + evt.coordinate[1]
    })
})

// 折叠面板
const activeNamesCollapse = ref(['1'])
const activeNamesCollapseCoor = ref(['2'])
// 坐标类型
const coordinateInput = ref('')
const coordinateType = ref(['GCJ02'])
const coordinateTextarea = ref()
// 控制图层显隐
const checkLayer = (index: number) => {
    if (mapLayers[index].check === false) {
        mapLayers[index].layer.setVisible(false)
    } else {
        mapLayers[index].layer.setVisible(true)
    }
}

// 选择坐标类型
const statusChange = () => {
    if (coordinateType.value.length > 1) {
        coordinateType.value.splice(0, 1)
    }
    console.log(keyJson.keyTianditu)
}
// 转换坐标
const transLonLat = () => {
    let coorWGS84, coorGCJ02, coorBD09
    if (!coordinateInput.value) {
        ElMessage('请输入坐标')
    } else {
        if (coordinateType.value[0] === 'WGS84') {
            coorWGS84 = coordinateInput.value.split(',').map(Number)
            coorGCJ02 = transCoor(coordinateInput.value.split(',').map(Number), 1, 2)
            coorBD09 = transCoor(coorGCJ02, 2, 3)
        } else if (coordinateType.value[0] === 'GCJ02') {
            coorWGS84 = transCoor(coordinateInput.value.split(',').map(Number), 2, 1)
            coorGCJ02 = coordinateInput.value.split(',').map(Number)
            coorBD09 = transCoor(coordinateInput.value.split(',').map(Number), 2, 3)
        }
        const featureWGS84 = new Feature(new Point(coorWGS84 as Coordinate))
        const featureGCJ02 = new Feature(new Point(coorGCJ02 as Coordinate))
        const featureBD09 = new Feature(new Point(coorBD09 as Coordinate))
        featureWGS84.setStyle(styleLocateWGS84)
        featureGCJ02.setStyle(styleLocateGCJ02)
        featureBD09.setStyle(styleLocateBD09)
        locateSource.clear()
        locateSource.addFeature(featureWGS84)
        locateSource.addFeature(featureGCJ02)
        locateSource.addFeature(featureBD09)
        // 输出坐标
        coordinateTextarea.value = `WGS84：${coorWGS84}  GCJ02：${coorGCJ02}  BD09：${coorBD09}`
    }
}
// 聚焦函数
const focusMapWithInputCoor = () => {
    map.getView().setCenter(coordinateInput.value.split(',').map(Number))
}
// 定位点样式
const styleLocateWGS84 = new Style({
    image: new Icon({
        src: getAssetsFile('locate-red.png'),
        size: [64, 64],
        offset: [-17, -5]
    }),
    text: new Text({
        text: 'WGS84',
        font: '15px sans-serif',
        offsetX: -3,
        offsetY: -32,
        fill: new Fill({
            color: 'red'
        })
    })
})
const styleLocateGCJ02 = new Style({
    image: new Icon({
        src: getAssetsFile('locate-blue.png'),
        size: [64, 64],
        offset: [-17, -5]
    }),
    text: new Text({
        text: 'GCJ-02',
        font: '15px sans-serif',
        offsetX: -3,
        offsetY: -32,
        fill: new Fill({
            color: 'blue'
        })
    })
})
const styleLocateBD09 = new Style({
    image: new Icon({
        src: getAssetsFile('locate-green.png'),
        size: [64, 64],
        offset: [-17, -5]
    }),
    text: new Text({
        text: 'BD-09',
        font: '15px sans-serif',
        offsetX: -3,
        offsetY: -32,
        fill: new Fill({
            color: 'green'
        })
    })
})

</script>

<template>
    <el-collapse class="collapse-layer" v-model="activeNamesCollapse">
        <el-collapse-item title="&nbsp&nbsp&nbsp&nbsp图层管理" name="1">
            <div class="box-in-collapse">
                <el-checkbox v-for="(item) in mapLayers" :key="item.id" v-model="item.check" :label="item.name"
                    size="large" @change="checkLayer(item.id)" />
            </div>
        </el-collapse-item>
    </el-collapse>
    <el-collapse class="collapse-coor" v-model="activeNamesCollapseCoor">
        <el-collapse-item title="&nbsp&nbsp&nbsp&nbsp坐标转换" name="2">
            <div id="collapse-item-coor">
                <div class="box-in-collapse container-input-coor">
                    <span>输入坐标或者点击地图拾取坐标</span>
                    <el-input v-model="coordinateInput" :rows="2" type="textarea" />
                    <span>选择坐标类型</span>
                    <el-checkbox-group v-model="coordinateType" @change="statusChange">
                        <el-checkbox label="WGS84"></el-checkbox>
                        <el-checkbox label="GCJ02"></el-checkbox>
                        <el-checkbox label="BD09"></el-checkbox>
                    </el-checkbox-group>
                    <el-button @click="focusMapWithInputCoor">
                        聚焦<el-icon>
                            <Aim />
                        </el-icon>
                    </el-button>
                </div>
                <div class="box-in-collapse">
                    <el-button type="primary" @click="transLonLat">
                        转换<el-icon>
                            <DArrowRight />
                        </el-icon>
                    </el-button>
                    <br>
                    
                </div>
                <div class="box-in-collapse container-output-coor">
                    <span>输出坐标</span>
                    <el-input v-model="coordinateTextarea" :rows="8" type="textarea" />
                </div>
            </div>
        </el-collapse-item>
    </el-collapse>
    <div id="map" class="map"></div>
    <div id="mouse-position" style="position:absolute; top: 100px"></div>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}

/* 折叠面板 */
.box-in-collapse {
    margin: 10px;
    padding: 10px;
    border-radius: 1rem;
}

.el-checkbox {
    display: flex;
    margin-right: 0;
}

#collapse-item-coor {
    display: flex;
    flex-direction: row;
}

.container-output-coor {
    background-color: rgb(251 251 251);
}

.container-input-coor {
    background-color: rgb(251 251 251);
}

.collapse-layer {
    position: absolute;
    top: 20px;
    left: 50px;
    width: 200px;
    z-index: 10;
}

.collapse-coor {
    position: absolute;
    top: 20px;
    left: 300px;
    z-index: 10;
}

.el-collapse-item__content {
    padding-left: 20px;
}

.el-button {
    margin-top: 10px;
}
.el-textarea {
    display: block;
    width: 250px;
}
/* 鼠标位置坐标展示 */
:deep .custom-mouse-position {
    position: absolute;
    bottom: 20px;
    right: 20px;
}
</style>