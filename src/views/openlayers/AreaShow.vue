<!--
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2024-02-06 10:05:39
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-05-30 17:13:29
 * @FilePath: \GisShow\src\views\openlayers\AreaShow.vue
 * @Description: 
-->
<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Style, Stroke, Text, Fill } from 'ol/style'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { onMounted, ref } from 'vue'
import gcjMecator from '@/utils/gcj02ToWgs84.js'
import { WKT } from 'ol/format'
import { areaApi } from '@/api'
import { getCascaderOption } from '@/utils/cascader-option.js'

const areaNameSelected = ref('')
const cascaderOptions = getCascaderOption(3, 'TDT')
// 定义map
const mapObj = {
  center: [104, 34.676],
  zoom: 5
}
let zoom = ref(0)

// 省图层
const sourceArea = new VectorSource()
const layerAreaTDT = new Vector({
  source: sourceArea,
  style: feature => {
    const name = feature.getProperties().name
    const code = feature.getProperties().code
    return new Style({
      stroke: new Stroke({
        color: '#2b56e3'
      }),
      fill: new Fill({
        color: '#00c9ff57'
      }),
      text: new Text({
        text: name + code,
        fill: new Fill({
          color: 'red'
        })
      })
    })
  }
})
let map = new Map({})
onMounted(() => {
  map = new Map({
    layers: [gaodeTileLayer, layerAreaTDT],
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
  initProvince()
})
// 高德瓦片
const gaodeTileLayer = new TileLayer({
  source: new XYZ({
    projection: gcjMecator,
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
const initProvince = () => {
  areaNameSelected.value = ''
  areaApi.getAreaByLevelCodeType(1, null, 'TDT').then(res => {
    sourceArea.clear()
    res.forEach(element => {
      const format = new WKT()
      const feature = format.readFeature(element.geo)
      delete element.geo
      feature.setProperties(element)
      sourceArea.addFeature(feature)
    })
    map.getView().fit(sourceArea.getExtent())
  })
}
const handleChange = (value) => {
  const type = 'TDT'
  const level = value.length + 1
  const code = value[value.length - 1]
  areaApi.getAreaByLevelCodeType(level, code, type).then((res) => {
    sourceArea.clear()
    res.forEach(element => {
      if(element.geo) {
        const format = new WKT()
        const feature = format.readFeature(element.geo)
        delete element.geo
        feature.setProperties(element)
        sourceArea.addFeature(feature)
        map.getView().fit(sourceArea.getExtent())
      }
    })
  })
}
</script>

<template>
  <div id="zoom-level-now">当前级别：{{ zoom }}</div>
  <el-card id="tool-card">
    <el-button id="button-china" type="primary" @click="initProvince">全国</el-button>
    <el-cascader v-model="areaNameSelected" placeholder="行政区划选择" :props="cascaderOptions" style="width: 100%"
      @change="handleChange" @expand-change="handleExpandChange" @close="handleClose" />
  </el-card>
  <div id="map" class="map"></div>
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
  font-size: 15px;
  /*设置文字大小*/
  color: #3366FF;
  /*设置文字颜色*/
  text-shadow: 0 8px 10px #6699FF;
  /*设置文字阴影*/
  font-weight: bolder;
  /*设置文字宽度*/
}

#zoom-level-now {
  position: absolute;
  bottom: 20px;
  right: 200px;
  z-index: 1;
  font-size: 15px;
  /*设置文字大小*/
  color: #3366FF;
  /*设置文字颜色*/
  text-shadow: 0 8px 10px #6699FF;
  /*设置文字阴影*/
  font-weight: bolder;
  /*设置文字宽度*/
}
#button-china{
  width: 100%;
  margin-bottom: 5px;
}
#tool-card {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  width: 500px;
}
</style>