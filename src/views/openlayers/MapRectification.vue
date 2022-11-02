<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { onMounted, reactive, ref } from 'vue'
import { OSM, TileImage } from 'ol/source'
import { MousePosition} from 'ol/control'
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
import { Icon, Text, Style, Circle, Stroke, Fill } from 'ol/style'
import getAssetsFile from '@/utils/sys-use'
import TileGrid from 'ol/tilegrid/TileGrid'

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
// 百度图层
// 自定义分辨率和瓦片坐标系
var resolutions = []
var maxZoom = 18
 
// 计算百度使用的分辨率
for(var i=0; i<=maxZoom; i++){
    resolutions[i] = Math.pow(2, maxZoom-i)//(幂运算)
}
var tilegrid  = new TileGrid({
    origin: [0,0],    // 设置原点坐标
    resolutions: resolutions    // 设置分辨率
})
 
// 创建百度地图的数据源
var baiduSource = new TileImage({
    projection: 'EPSG:3857',    
    tileGrid: tilegrid,
    tileUrlFunction: function(tileCoord, pixelRatio, proj){
        var z = tileCoord[0] as any
        var x = tileCoord[1] as any
        var y = tileCoord[2] as any
 
        // 百度瓦片服务url将负数使用M前缀来标识
        if(x<0){
            x = 'M' + (x)
        }
        if(y<0){
            y = 'M' + (y)
        }
 
        return 'http://online3.map.bdimg.com/onlinelabel/?qt=tile&x='+x+'&y='+y+'&z='+z+'&styles=pl&udt=20160426&scaler=1&p=1'
    }
})
 
// 百度地图层
var baiduMapLayer = new TileLayer({
    source: baiduSource,
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
},{
    id: 2,
    name: '百度底图',
    layer: baiduMapLayer,
    check: false
}, {
    id: 23,
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
        layers: [gaodeTileLayer, gaodeRectificationLayer, baiduMapLayer, tileLayerTianDiTu, tileLayerTianDiTuZhuJi, osmLayer, locateLayer],
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
        coordinateInput.value = evt.coordinate       
    })
})

// 折叠面板
const activeNamesCollapse = ref(['1'])
// 坐标类型
const coordinateInput = ref()
const coordinateType = ref(['WGS84'])
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
        if(coordinateType.value[0] === 'WGS84'){
            coorWGS84 = coordinateInput.value
            coorGCJ02 = transCoor(coordinateInput.value, 1, 2)
            coorBD09 = transCoor(coordinateInput.value, 1, 2)
        }
        const featureWGS84 = new Feature(new Point(coorWGS84))
        const featureGCJ02 = new Feature(new Point(coorGCJ02 as Coordinate))
        const featureBD09 = new Feature(new Point(coorBD09 as Coordinate))
        featureWGS84.setStyle(styleLocateWGS84)
        featureGCJ02.setStyle(styleLocateGCJ02)
        
        locateSource.addFeature(featureWGS84)
        locateSource.addFeature(featureGCJ02)
    }
}
// 定位点样式
const styleLocateWGS84 = new Style({
    image: new Icon({
        src: getAssetsFile('locate-red.png'),
        size:[64,64],
        offset:[-17, -5]
    }),
    text: new Text({
        text:'WGS84',
        font:'15px sans-serif',
        offsetX:-3,
        offsetY:-32,
        fill: new Fill({
            color: 'red'
        })
    })
})
const styleLocateGCJ02 = new Style({
    image: new Icon({
        src: getAssetsFile('locate-blue.png'),
        size:[64,64],
        offset:[-17, -5]
    }),
    text: new Text({
        text:'GCJ-02',
        font:'15px sans-serif',
        offsetX:-3,
        offsetY:-32,
        fill: new Fill({
            color: 'blue'
        })
    })
})
const styleLocateBD09 = new Style({
    image: new Icon({
        src: getAssetsFile('locate-green.png'),
        size:[64,64],
        offset:[-17, -5]
    }),
    text: new Text({
        text:'BD-09',
        font:'15px sans-serif',
        offsetX:-3,
        offsetY:-32,
        fill: new Fill({
            color: 'green'
        })
    })
})

</script>

<template>
    <el-collapse v-model="activeNamesCollapse">
        <el-collapse-item title="&nbsp&nbsp&nbsp&nbsp图层管理" name="1">
            <div class="box-in-collapse">
                <el-checkbox v-for="(item) in mapLayers" :key="item.id" v-model="item.check" :label="item.name"
                    size="large" @change="checkLayer(item.id)" />
            </div>
        </el-collapse-item>
        <el-collapse-item title="&nbsp&nbsp&nbsp&nbsp坐标转换" name="2">
            <div class="box-in-collapse">
                <span>输入坐标</span>
                <el-input v-model="coordinateInput" :rows="2" type="textarea" />
                <span>选择坐标类型</span>
                <el-checkbox-group v-model="coordinateType" @change="statusChange">
                    <el-checkbox label="WGS84"></el-checkbox>
                    <el-checkbox label="GCJ02"></el-checkbox>
                    <el-checkbox label="BD09"></el-checkbox>
                </el-checkbox-group>
                <el-button @click="transLonLat">转换</el-button>
                <br>
                <span>输出坐标</span>
                <el-input v-model="coordinateTextarea" :rows="8" type="textarea" />
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
}

.el-checkbox {
    display: flex;
    margin-right: 0;
}

.el-collapse {
    position: absolute;
    top: 20px;
    left: 50px;
    width: 200px;
    z-index: 10;
}

.el-collapse-item__content {
    padding-left: 20px;
}
/* 鼠标位置坐标展示 */
:deep .custom-mouse-position {
    position: absolute;
    bottom: 20px;
    right: 20px;
}

</style>