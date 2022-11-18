<script setup lang='ts'>
import { ref, onMounted, watch } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'

import getColorLayer from '../../utils/tile-color-change'
import { Layer } from 'ol/layer'

// 滑动条定义及默认值
const valueGrayScale = ref(98)
const valueInvert = ref(90)
const valueSepia = ref(60)
const valueSaturate = ref(90)
const valueBrightness = ref(100)
const valueContrast = ref(100)
const valueHueRotate = ref(180)
// 是否展示滑动条框
const isShowGroupSlider = ref(false)
// 当前选择的颜色选择框
const radioSelected = ref('graygreen-quick')
// 地图参数定义
const params = {
    mapCenter: [106.408845, 34.653968]
}
let map: Map = new Map({})
let colorLayer = new Layer({})
// 生命周期函数
onMounted(() => {
    loadMap()
})
// 底图变色的第二种方式，该方式加载速度快
const layerGaode2 = new TileLayer({
    source: new XYZ({
        // projection: gcjMecator,
        url: 'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        tileLoadFunction: function (imageTile, src) {
            // 使用滤镜 将白色修改为深色
            var img = new Image()
            // img.crossOrigin = ''
            // 设置图片不从缓存取，从缓存取可能会出现跨域，导致加载失败
            img.setAttribute('crossOrigin', 'anonymous')
            img.onload = function () {
                var canvas = document.createElement('canvas') as HTMLCanvasElement
                var w = img.width
                var h = img.height
                canvas.width = w
                canvas.height = h
                var context = canvas.getContext('2d') as CanvasRenderingContext2D
                context.drawImage(img, 0, 0, w, h, 0, 0, w, h)
                var imageData = context.getImageData(0, 0, w, h)
                for (let i = 0; i < imageData.height; i++) {
                    for (let j = 0; j < imageData.width; j++) {
                        var x = (i * 4) * imageData.width + (j * 4)
                        var r = imageData.data[x]
                        var g = imageData.data[x + 1]
                        var b = imageData.data[x + 2]
                        imageData.data[x] = 55 - imageData.data[x]
                        imageData.data[x + 1] = 255 - imageData.data[x + 1]
                        imageData.data[x + 2] = 305 - imageData.data[x + 2]
                    }
                }
                context.putImageData(imageData, 0, 0)
                // 默认是Tile类型, 强行指定为ImageTile时，tileLoadFunction报类型不兼容
                imageTile.getImage().src = canvas.toDataURL('image/png')
            }
            img.src = src
        }
    })
})

// 底图变色的第三种方式，该方式通过灰CSS3滤镜，改变地图风格，加载速度最快
let sourceXYZ3 = new XYZ({
    // projection: gcjMecator,
    url: 'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    tileLoadFunction: function (imageTile, src) {
        // 使用滤镜 将白色修改为深色
        var img = new Image()
        // img.crossOrigin = ''
        // 设置图片不从缓存取，从缓存取可能会出现跨域，导致加载失败
        img.setAttribute('crossOrigin', 'anonymous')
        img.onload = function () {
            var canvas = document.createElement('canvas') as HTMLCanvasElement
            var w = img.width
            var h = img.height
            canvas.width = w
            canvas.height = h
            var context = canvas.getContext('2d') as CanvasRenderingContext2D
            context.filter = `grayscale(${valueGrayScale.value}%) invert(${valueInvert.value}%) sepia(${valueSepia.value}%) hue-rotate(${valueHueRotate.value}deg) saturate(${valueSaturate.value}%) brightness(${valueBrightness.value}%) contrast(${valueContrast.value}%)`
            context.drawImage(img, 0, 0, w, h, 0, 0, w, h)
            imageTile.getImage().src = canvas.toDataURL('image/png')
        }
        img.src = src
    }
})
const layerGaode3 = new TileLayer({
    source: sourceXYZ3
})
// 加载地图
function loadMap() {
    map = new Map({
        // layers: [gaodeLayer],
        target: 'map',
        view: new View({
            center: params.mapCenter,
            zoom: 4,
            projection: 'EPSG:4326',
        })
    })
    colorLayer = layerGaode2
    map.addLayer(colorLayer)
}

// 选择颜色选择框事件
const selectColorRadio = () => {
    map.removeLayer(colorLayer)
    if (radioSelected.value === 'graygreen-quick') {
        colorLayer = layerGaode2
    } else if (radioSelected.value === 'color-css') {
        colorLayer = layerGaode3
    } else {
        colorLayer = getColorLayer('gaode', radioSelected.value)
    }
    map.addLayer(colorLayer)
}

// 滑动条滑动事件
const sliderMove = () => {
    sourceXYZ3 = new XYZ({
    // projection: gcjMecator,
        url: 'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        tileLoadFunction: function (imageTile, src) {
        // 使用滤镜 将白色修改为深色
            var img = new Image()
            // img.crossOrigin = ''
            // 设置图片不从缓存取，从缓存取可能会出现跨域，导致加载失败
            img.setAttribute('crossOrigin', 'anonymous')
            img.onload = function () {
                var canvas = document.createElement('canvas') as HTMLCanvasElement
                var w = img.width
                var h = img.height
                canvas.width = w
                canvas.height = h
                var context = canvas.getContext('2d') as CanvasRenderingContext2D
                context.filter = `grayscale(${valueGrayScale.value}%) invert(${valueInvert.value}%) sepia(${valueSepia.value}%) hue-rotate(${valueHueRotate.value}deg) saturate(${valueSaturate.value}%) brightness(${valueBrightness.value}%) contrast(${valueContrast.value}%)`
                context.drawImage(img, 0, 0, w, h, 0, 0, w, h)
                imageTile.getImage().src = canvas.toDataURL('image/png')
            }
            img.src = src
        }
    })
    layerGaode3.setSource(sourceXYZ3)
}
// 滑动条提示文字格式%
const formatTooltipPercent = (val: number) => {  
    return val + '%'
}
// 滑动条提示文字格式deg
const formatTooltipDeg = (val: number) => {  
    return val + 'deg'
}
// 侦听器，根据radio选择，控制slider是否展示
watch(radioSelected, async(newVal) => {
    if(newVal === 'color-css') {
        isShowGroupSlider.value = true
    } else {
        isShowGroupSlider.value = false
    }
})
</script>

<template>
    <el-card class="radio-group">
        <el-radio-group v-model="radioSelected" class="ml-4" @change="selectColorRadio">
            <el-radio label="gray">灰色</el-radio>
            <el-radio label="blue">蓝色</el-radio>
            <el-radio label="graygreen">灰绿色</el-radio>
            <el-radio label="black">灰黑色</el-radio>
            <el-radio label="reversal">反转色</el-radio>
            <el-radio label="graygreen-quick">蓝绿色(快速加载)</el-radio>
            <el-radio label="color-css">灰黑色(CSS3滤镜)</el-radio>
        </el-radio-group>
    </el-card>
    <el-card class="slider-group" v-show="isShowGroupSlider">
        <div class="slider-demo-block">
            <span class="demonstration">亮度</span>
            <el-slider v-model="valueBrightness" show-input size="small" @change="sliderMove" :format-tooltip="formatTooltipPercent"/>
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">对比度</span>
            <el-slider v-model="valueContrast" show-input size="small" @change="sliderMove" :format-tooltip="formatTooltipPercent"/>
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">饱和度</span>
            <el-slider v-model="valueSaturate" show-input size="small" @change="sliderMove" :format-tooltip="formatTooltipPercent"/>
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">色调360</span>
            <el-slider v-model="valueHueRotate" show-input size="small" max="360" @change="sliderMove" :format-tooltip="formatTooltipDeg"/>
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">灰度</span>
            <el-slider v-model="valueGrayScale" show-input size="small" @change="sliderMove" :format-tooltip="formatTooltipPercent"/>
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">反转色</span>
            <el-slider v-model="valueInvert" show-input size="small" @change="sliderMove" :format-tooltip="formatTooltipPercent"/>
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">棕褐色</span>
            <el-slider v-model="valueSepia" show-input size="small" @change="sliderMove" :format-tooltip="formatTooltipPercent"/>
        </div>
    </el-card>
    <div id="map" class="map"></div>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}

.radio-group {
    position: absolute;
    z-index: 1;
    background-color: #eeeeeeed;
    border-radius: 10px;
    top: 20px;
    left: 20px;
}

/* 滑动条开始 */
.slider-group {
    position: absolute;
    z-index: 1;
    background-color: #eeeeeeed;
    border-radius: 10px;
    top: 100px;
    left: 20px;
    width: 800px;
}

.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 1px;
}
.slider-demo-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 30px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
.slider-demo-block .demonstration + .el-slider {
  flex: 0 0 90%;
}
</style>