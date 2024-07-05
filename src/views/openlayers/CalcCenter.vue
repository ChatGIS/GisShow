<!--
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2024-05-18 22:19:16
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-18 22:51:31
 * @FilePath: \GisShow\src\views\openlayers\CalcCenter.vue
 * @Description: 
-->

<script setup>
import 'ol/ol.css'
import { Map, View, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { onMounted, ref } from 'vue'
import { getCenter } from 'ol/extent'
import { Point } from 'ol/geom'
import { Draw } from 'ol/interaction'
import * as turf from '@turf/turf'
import { Fill, Style, Text, Circle } from 'ol/style'

let map = new Map({})
let drawer
const selectDrawType = ref('LineString')
// 定义map
const mapObj = {
  center: [117.024, 36.676],
  zoom: 15
}
let zoom = ref(0)
const selectDrawOptions = [/* {
    value: 'Point',
    label: '点',
}, */
  {
    value: 'LineString',
    label: '线',
  }/* ,
    {
        value: 'Polygon',
        label: '面',
    },
    {
        value: 'Circle',
        label: '圆',
    } */]
const sourceDraw = new VectorSource()
const vectorDraw = new VectorLayer({
  source: sourceDraw,
})
onMounted(() => {
  map = new Map({
    layers: [gaodeTileLayer, vectorDraw],
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
    zoom.value = Math.round(map.getView().getZoom())
  })
  addInteractions()

})

// 高德瓦片
const gaodeTileLayer = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
  })
})

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
  coordinateFormat: createStringXY(6),
  projection: 'EPSG:4326',
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position')
})

// 清空绘制图层
function clearDrawLayer(){
  sourceDraw.clear()
}

// 添加交互
const addInteractions = () => {
  drawer = new Draw({
    source: sourceDraw,
    type: selectDrawType.value,
  })
  map.addInteraction(drawer)
  drawer.on('drawend', (e) => {
    console.log(e)
    calcCenterByOlFunc(e.feature)
    calcCenterByOlExtent(e.feature)
    calcCenterBySelf(e.feature)
    calcCenterByTurf(e.feature)
  })
}
// 选择框改变事件
function selectChange() {
  map.removeInteraction(drawer)
  addInteractions()
}
/**
 * @description: 根据openlayers的Extent的getCenter计算中心点
 * @param {*} feature
 * @return {*}
 */
const calcCenterByOlFunc = (feature) => {
  const geom = feature.getGeometry()
  const center = geom.getCoordinateAt(0.5)
  console.log(center) // 输出中心点坐标
  var centerFeature = new Feature({
    geometry: new Point(center)
  })
  centerFeature.setStyle(
    new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({
          color: 'green'
        })
      }),
      text: new Text({
        text: 'getCoordinateAt'
      })
    })
  )
  sourceDraw.addFeature(centerFeature)
}
const calcCenterByOlExtent = (feature) => {
  const geom = feature.getGeometry()
  var center = getCenter(geom.getExtent())
  console.log(center) // 输出中心点坐标
  var centerFeature = new Feature({
    geometry: new Point(center)
  })
  centerFeature.setStyle(
    new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: 'red'
        })
      }),
      text: new Text({
        text: 'OlExtent.getCenter'
      })
    })
  )
  sourceDraw.addFeature(centerFeature)
}
const calcCenterBySelf = (feature) => {
  const geom = feature.getGeometry()
  // 获取LineString的坐标数组
  var coordinates = geom.getCoordinates()

  // 计算LineString的中心点坐标
  var totalX = 0
  var totalY = 0
  coordinates.forEach(function(coord) {
    totalX += coord[0]
    totalY += coord[1]
  })
  var centerX = totalX / coordinates.length
  var centerY = totalY / coordinates.length

  var center = [centerX, centerY]

  console.log(center) // 输出中心点坐标
  var centerFeature = new Feature({
    geometry: new Point(center)
  })
  centerFeature.setStyle(
    new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: 'blue'
        })
      }),
      text: new Text({
        text: 'Self'
      })
    })
  )
  sourceDraw.addFeature(centerFeature)
}
const calcCenterByTurf = (feature) => {
  const geom = feature.getGeometry()
  // 获取LineString的坐标数组
  var coordinates = geom.getCoordinates()

  const line = turf.lineString(coordinates)

  // 计算线的中心点坐标
  const center = turf.center(line)

  console.log(center.geometry.coordinates) // 输出中心点坐标
  var centerFeature = new Feature({
    geometry: new Point(center.geometry.coordinates)
  })
  centerFeature.setStyle(
    new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: 'yellow'
        })
      }),
      text: new Text({
        text: 'turf'
      })
    })
  )
  sourceDraw.addFeature(centerFeature)
}
</script>

<template>
    <div id="zoom-level-now">当前级别：{{zoom}}</div>
    <div id="map" class="map"></div>
    <el-card class="box-card">
        <label for="type">图形类型&nbsp;</label>
        <el-select v-model="selectDrawType" class="m-2" placeholder="选择绘制类型" v-on:change="selectChange">
            <el-option v-for="item in selectDrawOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="clearDrawLayer">清空图层</el-button>
        <el-button type="primary" style="margin-left: 16px" @click="openDrawe">打开数据列表</el-button>
    </el-card>
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
    font-size: 15px;   /*设置文字大小*/
    color:#3366FF;  /*设置文字颜色*/
    text-shadow: 0 8px 10px #6699FF;  /*设置文字阴影*/                  
    font-weight: bolder;  /*设置文字宽度*/      
}

#zoom-level-now {
    position: absolute;
    bottom: 20px;
    right: 200px;
    z-index: 1;
    font-size: 15px;   /*设置文字大小*/
    color:#3366FF;  /*设置文字颜色*/
    text-shadow: 0 8px 10px #6699FF;  /*设置文字阴影*/                  
    font-weight: bolder;  /*设置文字宽度*/                              
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
</style>