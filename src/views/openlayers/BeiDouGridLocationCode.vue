
<template>
  <div id="zoom-level-now">当前级别：{{zoom}}</div>
  <div id="map" class="map"></div>
  <el-card id="tool-card">
    <el-row>
      点击位置：{{ coorLonClick }}, {{ coorLatClick }}
    </el-row>
    <el-row>
      <el-checkbox v-model="isShowGrid01" :label="labelGrid01" size="large" @change="handleChangeShow01"/>
      <span class="text-grid-code">{{ nameGrid01Click }}</span>
    </el-row>
    <el-row>
      <el-checkbox v-model="isShowGrid02" :label="labelGrid02" size="large" @change="handleChangeShow02"/>
      <span class="text-grid-code">{{ nameGrid02Click }}</span>
    </el-row>
    <el-row>
      <el-checkbox v-model="isShowGrid03" :label="labelGrid03" size="large" @change="handleChangeShow03"/>
      <span class="text-grid-code">{{ nameGrid03Click }}</span>
    </el-row>
  </el-card>
</template>
<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { onMounted, ref } from 'vue'
import gcjMecator from '@/utils/gcj02ToWgs84.js'
import { Polygon } from 'ol/geom'
import { Feature } from 'ol'
import { Style, Fill, Text, Stroke } from 'ol/style'
import { ElMessage } from 'element-plus'


// 定义map
let map = new Map({})
const mapObj = {
  center: [0, 0],
  zoom: 1
}
let zoom = ref(0)
let coorLonClick = ref(0)
let coorLatClick = ref(0)
let nameGrid01Click = ref('')
let nameGrid02Click = ref('')
let nameGrid03Click = ref('')
let nameCurrentClick = ref('')
let rangeCurrentClick = ref([])
const isShowGrid01 = ref(true)
const isShowGrid02 = ref(false)
const isShowGrid03 = ref(false)

const labelGrid01 = ref('一级网格')
const sourceGrid01 = new VectorSource({})
const layerGrid01 = new VectorLayer({
  source: sourceGrid01,
  style: (feature) => {
    return new Style({
      fill: new Fill({
        color: 'rgba(255, 0, 255, 0.3)'
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.9)'
      }),
      text: new Text({
        text: feature.get('name')
      })
    })
  }
})
const labelGrid02 = ref('二级网格')
const labelGrid03 = ref('三级网格')
const sourceGrid02 = new VectorSource({})
const layerGrid02 = new VectorLayer({
  source: sourceGrid02,
  style: (feature) => {
    return new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 0, 0.3)'
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.9)'
      }),
      text: new Text({
        text: feature.get('name')
      })
    })
  }
})
const sourceGrid03 = new VectorSource({})
const layerGrid03 = new VectorLayer({
  source: sourceGrid03,
  style: (feature) => {
    return new Style({
      fill: new Fill({
        color: 'rgba(0, 255, 255, 0.3)'
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.9)'
      }),
      text: new Text({
        text: feature.get('name')
      })
    })
  }
})
onMounted(() => {
  map = new Map({
    layers: [gaodeTileLayer, layerGrid03, layerGrid02, layerGrid01],
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
  map.on('singleclick', (event) => {
    const coordinate = event.coordinate
    coorLonClick.value = coordinate[0]
    coorLatClick.value = coordinate[1]
    layerGrid01.getFeatures(event.pixel).then(res => {
      if(res.length == 0) {
        nameGrid01Click.value = ''
        return
      }
      const p1 = res[0].getGeometry().getCoordinates()[0][0]
      const p2 = res[0].getGeometry().getCoordinates()[0][2]
      nameGrid01Click.value = `${res[0].getProperties().name}, 对角经纬：${p1[0]},${p1[1]},${p2[0]},${p2[1]}`
    })
    layerGrid02.getFeatures(event.pixel).then(res => {
      if(res.length == 0) {
        nameGrid02Click.value = ''
        return
      }
      const p1 = res[0].getGeometry().getCoordinates()[0][0]
      const p2 = res[0].getGeometry().getCoordinates()[0][2]
      nameCurrentClick.value = res[0].getProperties().name
      rangeCurrentClick.value = [p1[0], p1[1], p2[0], p2[1]]
      nameGrid02Click.value = `${res[0].getProperties().name}, 对角经纬：${p1[0]},${p1[1]},${p2[0]},${p2[1]}`
    })
  })
  generateGrid01()
  // generateGrid02()
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

const generateGrid01 = () => {
  sourceGrid01.clear()
  const features = []
  for(let i = -30; i < 30; i++) {
    for(let j = -22; j < 22; j++) {
      let mayuan1 = 'N'
      let mayuan23 = (i + 31).toString().padStart(2, '0')
      let mayuan4 = 'A'
      if(j < 0) {
        mayuan1 = 'S'
        mayuan4 = String.fromCharCode(65 + Math.abs(j) - 1)
      } else {
        mayuan4 = String.fromCharCode(65 + Math.abs(j))
      }
      let feature = new Feature({
        geometry: new Polygon([
          [
            [6 * i, 4 * j],
            [6 * (i + 1), 4 * j],
            [6 * (i + 1), 4 * (j + 1)],
            [6 * i, 4 * (j + 1)],
            [6 * i, 4 * j],
          ]
        ]),
        name: `${mayuan1}${mayuan23}${mayuan4}`
      })
      features.push(feature)
    }
  }
  labelGrid01.value = `一级网格（${features.length}）`
  sourceGrid01.addFeatures(features)
}
const generateGrid02 = () => {
  sourceGrid02.clear()
  const features = []
  for(let i = -30; i < 30; i++) {
    for(let j = -22; j < 22; j++) {
      let mayuan1 = 'N'
      let mayuan23 = (i + 31).toString().padStart(2, '0')
      let mayuan4 = 'A'
      if(j < 0) {
        mayuan1 = 'S'
        mayuan4 = String.fromCharCode(65 + Math.abs(j) - 1)
      } else {
        mayuan4 = String.fromCharCode(65 + Math.abs(j))
      }
      if(j < 8 || j > 11 || i< 17 || i > 20) {
        continue
      }
      for(let k = 0; k < 12; k++) {
        for(let l = 0; l < 8; l++) {
          let mayuan5 = k
          if(k == 10) mayuan5 = 'A'
          if(k == 11) mayuan5 = 'B'
          let mayuan6 = l
          let feature = new Feature({
            geometry: new Polygon([
              [
                [6 * i + 0.5 * k, 4 * j + 0.5 * l],
                [6 * i + 0.5 * (k + 1), 4 * j + 0.5 * l],
                [6 * i + 0.5 * (k + 1), 4 * j + 0.5 * (l + 1)],
                [6 * i + 0.5 * k, 4 * j + 0.5 * (l + 1)],
                [6 * i + 0.5 * k, 4 * j + 0.5 * l],
              ]
            ]),
            name: `${mayuan1}${mayuan23}${mayuan4}${mayuan5}${mayuan6}`
          })
          features.push(feature)
        }    
      }
    }
  }
  labelGrid02.value = `二级网格（${features.length}）`
  sourceGrid02.addFeatures(features)
}
const generateGrid03 = () => {
  if(nameCurrentClick.value == '')  {
    ElMessage({
      message: '请选择二级网格',
      type: 'warning',
    })
  }
  sourceGrid03.clear()
  const features = []
  const stepX = (rangeCurrentClick.value[2] - rangeCurrentClick.value[0]) / 2
  const stepY = (rangeCurrentClick.value[3] - rangeCurrentClick.value[1]) / 3
  const baseX = rangeCurrentClick.value[0]
  const baseY = rangeCurrentClick.value[1]
  for(let i = 0; i < 2; i++) {
    for(let j = 0; j < 3; j++) {
      let mayuan7 = i + j * 2
      let feature = new Feature({
        geometry: new Polygon([
          [
            [baseX + stepX * i, baseY + stepY * j],
            [baseX + stepX * (i + 1), baseY + stepY * j],
            [baseX + stepX * (i + 1), baseY + stepY * (j + 1)],
            [baseX + stepX * i, baseY + stepY * (j + 1)],
            [baseX + stepX * i, baseY + stepY * j],
          ]
        ]),
        name: `${nameCurrentClick.value}${mayuan7}`
      })
      features.push(feature)
    }
  }
  labelGrid03.value = `三级网格（${features.length}）`
  sourceGrid03.addFeatures(features)
}
const handleChangeShow01 = (isShow) => {
  if(isShow) {
    generateGrid01()
  } else {
    sourceGrid01.clear()
  }
}
const handleChangeShow02 = (isShow) => {
  if(isShow) {
    generateGrid02()
    map.getView().fit(sourceGrid02.getExtent())
  } else {
    sourceGrid02.clear()
  }
}
const handleChangeShow03 = (isShow) => {
  if(isShow) {
    generateGrid03()
    map.getView().fit(sourceGrid03.getExtent())
  } else {
    sourceGrid03.clear()
  }
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
#tool-card {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  width: 500px;
}
.text-grid-code {
  margin-top: 12px;
  margin-left: 20px;
}
</style>