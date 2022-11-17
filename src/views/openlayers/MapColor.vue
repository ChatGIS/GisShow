<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'

import getColorLayer from '../../utils/tile-color-change'
import { Layer } from 'ol/layer'

const radioColor1 = ref('graygreen-quick')
const params = {
    mapCenter: [106.408845,34.653968]
}
let map: Map = new Map({})
let colorLayer = new Layer({})
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        // url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
        url: '/gaodetile/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})

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
const layerGaode3 = new TileLayer({
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
                context.filter = 'grayscale(98%) invert(90%) sepia(60%) hue-rotate(180deg) saturate(90%) brightness(100%) contrast(100%)'
                context.drawImage(img, 0, 0, w, h, 0, 0, w, h)
                imageTile.getImage().src = canvas.toDataURL('image/png')
            }
            img.src = src
        }
    })
})
      
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
    // 获取主题颜色图层
    colorLayer = layerGaode2

    //添加到地图
    map.addLayer(colorLayer)
}
// 地图切换颜色函数
const changeColor = () => {
    map.removeLayer(colorLayer)
    if(radioColor1.value === 'graygreen-quick'){
        colorLayer = layerGaode2
    } else if (radioColor1.value === 'gray-most-quick') {
        colorLayer = layerGaode3
    } else {
        colorLayer = getColorLayer('gaode', radioColor1.value)
    }
    map.addLayer(colorLayer)
}
</script>

<template>
    <el-card>
        <el-radio-group v-model="radioColor1" class="ml-4" @change="changeColor">
            <el-radio label="gray">灰色</el-radio>
            <el-radio label="blue">蓝色</el-radio>
            <el-radio label="graygreen">灰绿色</el-radio>
            <el-radio label="black">灰黑色</el-radio>
            <el-radio label="reversal">反转色</el-radio>
            <el-radio label="graygreen-quick">蓝绿色(快速加载)</el-radio>
            <el-radio label="gray-most-quick">灰黑色(CSS3滤镜)</el-radio>
        </el-radio-group>
    </el-card>
    <div id="map" class="map"></div>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}
.el-card {
    position: absolute;
    z-index: 1;
    background-color: #eeeeeeed;
    border-radius: 10px;
    top: 20px;
    left: 20px;
}
</style>