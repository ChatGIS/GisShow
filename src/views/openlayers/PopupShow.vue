<!--
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2024-07-06 20:29:53
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-06 22:41:53
 * @FilePath: \GisShow\src\views\openlayers\PopupShow.vue
 * @Description: 弹框展示
-->

<template>
  <div id="zoom-level-now">当前级别：{{zoom}}</div>
  <div id="map" class="map"></div>
  <PopupList ref="popupList" :featureInfos="featureInfos" 
    @clickInfo="clickInfo"
    @closePopup="closePopup"
    ></PopupList>
</template>
<script setup>
import 'ol/ol.css'
import { Feature, Map, View } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { onMounted, ref } from 'vue'
import gcjMecator from '@/utils/gcj02ToWgs84.js'
import { Point } from 'ol/geom'
import { Select } from 'ol/interaction'
import PopupList from '@/components/openlayers/PopupList.vue'
import { ElMessage } from 'element-plus'


// 定义map
let map = new Map({})
const mapObj = {
  center: [117.024, 36.676],
  zoom: 15
}
let zoom = ref(0)
// 业务数据
const attractions = [
  {
    name: '大明湖',
    lonlat: [117.026071, 36.67496695]
  }, {
    name: '超然楼',
    lonlat: [117.026071, 36.67496695]
  }, {
    name: '趵突泉',
    lonlat: [117.009977,36.660781]
  }
]
// 交互动作
let selecter = null
// 组件
const popupList = ref()
let featureInfos = ref([])
onMounted(() => {
  map = new Map({
    layers: [gaodeTileLayer, attractionLayer],
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
  addAttractions()
  addSelecter()
})

// 高德瓦片
const gaodeTileLayer = new TileLayer({
  source: new XYZ({
    projection: gcjMecator,
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
  })
})
// 景点图层
const attractionSource = new VectorSource()
const attractionLayer = new VectorLayer({
  source: attractionSource
})
// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
  coordinateFormat: createStringXY(6),
  projection: 'EPSG:4326',
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position')
})
/**
 * @description: 添加景点要素
 * @return {*}
 */
const addAttractions = () => {
  for(let i = 0; i < attractions.length; i++) {
    const attractionsFeature = new Feature({
      geometry: new Point(attractions[i].lonlat)
    })
    attractionsFeature.set('name', attractions[i].name)
    attractionSource.addFeature(attractionsFeature)
  }
}
/**
 * @description: 添加交互动作
 * @return {*}
 */
const addSelecter = () => {
  selecter = new Select({
    multi: true,  // 是否多选, 默认false
    layers: [attractionLayer]
  })
  map.addInteraction(selecter)
  selecter.on('select', (e) => {
    if(e.selected.length > 0) {
      featureInfos.value = []
      for(let i = 0; i < e.selected.length; i++) {
        featureInfos.value.push(e.selected[i].getProperties())
      }
      popupList.value.createPopup(e.mapBrowserEvent.coordinate, map)
    }
  })
}
/**
 * @description: 列表点击回传
 * @param {*} info
 * @return {*}
 */
const clickInfo = (info) => {
  ElMessage.success(`选择了${info.name}`)  
}
/**
 * @description: 关闭弹框回传
 * @return {*}
 */
const closePopup = () => {
  selecter.getFeatures().clear()
}
</script>
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
</style>