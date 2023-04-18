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
import { Point } from 'ol/geom'
import { Icon, Style,Circle as CircleStyle, Fill, Text, RegularShape } from 'ol/style'

// 定义map
const mapObj = {
    center: [117.024, 36.676],
    zoom: 15
}
let zoom = ref(0)
let map = new Map({})

let checkedPointCircle = ref(false)
let checkedPointTriangular = ref(false)
let checkedPointSquare = ref(false)
let checkedPointPentagram = ref(false)
let checkedPointArrowhead = ref(false)

onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, layerStyle],
        target: 'map',
        view: new View({
            center: mapObj.center,
            zoom: mapObj.zoom,
            projection: 'EPSG:4326',
        })
    })
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
// 样式要素
const featureCircle = new Feature(new Point([mapObj.center[0] + 0.01, mapObj.center[1]  + 0.01]))
const featureTriangular = new Feature(new Point([mapObj.center[0] + 0.008, mapObj.center[1] + 0.01]))
const featureSquare = new Feature(new Point([mapObj.center[0] + 0.006, mapObj.center[1] + 0.01]))
const featurePentagram = new Feature(new Point([mapObj.center[0] + 0.004, mapObj.center[1] + 0.01]))
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
    if(checkedPointCircle.value) {
        featureCircle.setStyle(new Style({
            image: new CircleStyle({
                radius: 20,
                fill: new Fill({
                    color: 'red'
                })
            })
        }))
        sourceStyle.addFeature(featureCircle)
    } else {
        sourceStyle.removeFeature(featureCircle)
    }
}
// 三角形
const toggleShowTriangular = () => {
    if(checkedPointTriangular.value) {
        featureTriangular.setStyle(new Style({
            image: new RegularShape({
                points: 3,
                radius: 20,
                fill: new Fill({
                    color: 'red'
                }),
                angle: 0
            })
        }))
        sourceStyle.addFeature(featureTriangular)
    } else {
        sourceStyle.removeFeature(featureTriangular)
    }
}
// 正方形
const toggleShowSquare = () => {
    if(checkedPointSquare.value) {
        featureSquare.setStyle(new Style({
            image: new RegularShape({
                points: 4,
                radius: 20,
                fill: new Fill({
                    color: 'red'
                }),
                angle: 0.79
            })
        }))
        sourceStyle.addFeature(featureSquare)
    } else {
        sourceStyle.removeFeature(featureSquare)
    }
}
// 五角星
const toggleShowPentagram = () => {
    if(checkedPointPentagram.value) {
        featurePentagram.setStyle(new Style({
            image: new RegularShape({
                points: 5,
                // radius: 20,
                fill: new Fill({
                    color: 'red'
                }),
                radius1: 20,
                radius2: 8,
                angle: 0
            })
        }))
        sourceStyle.addFeature(featurePentagram)
    } else {
        sourceStyle.removeFeature(featurePentagram)
    }
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
                <el-checkbox v-model="checkedPointArrowhead" label="箭头" size="large" @change="toggleShowArrowhead"/>
                <el-checkbox v-model="checkedPointPentagram" label="五角形" size="large" @change="toggleShowPentagram"/>
            </div>
        </div>
        <div id="ssss" class="style-container">线样式</div>
        <div id="ssss" class="style-container">面样式</div>
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