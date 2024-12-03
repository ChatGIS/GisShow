<template>
  <div id="zoom-level-now">当前级别：{{ zoom }}</div>
  <div id="map" class="map"></div>
  <el-card id="tool-card">
    <el-select v-model="typeAna" placeholder="Select" style="width: 240px" @change="handleChangeType">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-row>
      <el-col :span="12">
        <el-input v-model="textarea1" style="width: 240px" :rows="5" type="textarea" placeholder="输入wkt" @input="handleInput01"/>
      </el-col>
      <el-col :span="12">
        <el-input v-model="textarea2" style="width: 240px" :rows="5" type="textarea" placeholder="网格码" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-input v-model="textarea3" style="width: 240px" :rows="5" type="textarea" placeholder="输入wkt" @input="handleInput03"/>
      </el-col>
      <el-col :span="12">
        <el-input v-model="textarea4" style="width: 240px" :rows="5" type="textarea" placeholder="网格码" />
      </el-col>
    </el-row>
    <el-row>
      <el-input-number v-model="numLevel" :min="1" :max="10" @change="handleChangeLevel" />
      <span>生成网格数量</span><span>{{ numGrids }}</span>
    </el-row>
    <el-button type="primary" round @click="handleAnalyse">分析</el-button>
    <span>分析结果：</span><span>{{ result }}</span>
  </el-card>
</template>
<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Style, Fill, Text, Stroke, Circle } from 'ol/style'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { onMounted, ref } from 'vue'
import gcjMecator from '@/utils/gcj02ToWgs84.js'
import EntityCode2d from '@/utils/beidou/EntityCode2d'
import { Codec2D, Codec3D } from '@/utils/beidou/index'
import { WKT } from 'ol/format'

const typeAna = ref('1')
const result = ref('')
const textarea1 = ref('')
const textarea2 = ref('')
const textarea3 = ref('')
const textarea4 = ref('')
const numLevel = ref(4)
const numGrids = ref(0)
const options = [
  {
    value: '1',
    label: '点点相交分析',
  },
  {
    value: '2',
    label: '点线相交分析',
  },
  {
    value: '3',
    label: '点面相交分析',
  }
]

// 定义map
let map = new Map({})
const mapObj = {
  center: [117.024, 36.676],
  zoom: 15
}
let zoom = ref(0)

const sourceGrid01 = new VectorSource({})
const layerGrid01 = new VectorLayer({
  source: sourceGrid01,
  style: (feature) => {
    return new Style({
      image: new Circle({
        fill: new Fill({
          color: 'rgba(255, 0, 255)'
        }),
        radius: 5
      }),
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
const sourceGrid02 = new VectorSource({})
const layerGrid02 = new VectorLayer({
  source: sourceGrid02,
  style: (feature) => {
    return new Style({
      fill: new Fill({
        color: 'rgba(255, 0, 255, 0.3)'
      }),
      stroke: new Stroke({
        color: 'rgba(255, 0, 255, 0.8)'
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
      image: new Circle({
        fill: new Fill({
          color: 'rgba(0, 255, 0)'
        }),
        radius: 5
      }),
      fill: new Fill({
        color: 'rgba(0, 255, 0, 0.3)'
      }),
      stroke: new Stroke({
        color: 'rgba(0, 255, 0, 0.8)'
      }),
      text: new Text({
        text: feature.get('name')
      })
    })
  }
})
const sourceGrid04 = new VectorSource({})
const layerGrid04 = new VectorLayer({
  source: sourceGrid04,
  style: (feature) => {
    return new Style({
      fill: new Fill({
        color: 'rgba(0, 255, 0, 0.3)'
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
    layers: [gaodeTileLayer, layerGrid02, layerGrid04, layerGrid01, layerGrid03],
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
const handleInput01 = () => {
  if(typeAna.value <= '3') {
    const coor =  textarea1.value.split('(')[1].split(')')[0].split(' ').map(a => parseFloat(a))
    let lngLatNE = {
      lngDegree: coor[0],
      latDegree: coor[1]
    }
    textarea2.value = Codec2D.encode(lngLatNE, numLevel.value)
    // 生成点
    const wktFormat = new WKT()
    const point = wktFormat.readFeature(textarea1.value)
    sourceGrid01.clear()
    sourceGrid01.addFeature(point)
    map.getView().setCenter(coor)
    // 生成网格
    let extent = Codec2D.codeToExtent(textarea2.value)
    console.log(extent)
    let polywkt = extentToWkt(extent)
    console.log(polywkt)
    const grid = wktFormat.readFeature(polywkt)
    grid.setProperties({
      name: textarea2.value
    })
    sourceGrid02.clear()
    sourceGrid02.addFeature(grid)

  } else if(typeAna.value == '2') {
    // todo
  }
}
const handleInput03 = () => {
  if(typeAna.value == '1') {
    const coor =  textarea3.value.split('(')[1].split(')')[0].split(' ').map(a => parseFloat(a))
    let lngLatNE = {
      lngDegree: coor[0],
      latDegree: coor[1]
    }
    textarea4.value = Codec2D.encode(lngLatNE, numLevel.value)
    // 生成点
    const wktFormat = new WKT()
    const point = wktFormat.readFeature(textarea3.value)
    sourceGrid03.clear()
    sourceGrid03.addFeature(point)
    map.getView().setCenter(coor)
    // 生成网格
    let extent = Codec2D.codeToExtent(textarea4.value)
    console.log(extent)
    let polywkt = extentToWkt(extent)
    console.log(polywkt)
    const grid = wktFormat.readFeature(polywkt)
    grid.setProperties({
      name: textarea4.value
    })
    sourceGrid04.clear()
    sourceGrid04.addFeature(grid)

  } else if(typeAna.value == '2' || typeAna.value == '3') {
    // 线
    const wktFormat = new WKT()
    const line = wktFormat.readFeature(textarea3.value)
    sourceGrid03.clear()
    sourceGrid03.addFeature(line)
    // 生成插值网格
    const beidouCode = EntityCode2d.interpolationCode(textarea3.value, numLevel.value).beidouCode
    // const allPoints = EntityCode2d.interpolationCode(textarea3.value, numLevel.value).allPoints
    textarea4.value = beidouCode
    let codes = []
    if (beidouCode.indexOf(',') != 0) {
      codes = beidouCode.split(',')
    } else {
      codes = [beidouCode]
    }
    sourceGrid04.clear()
    for (let i = 0; i < codes.length; i++) {
      let extent = Codec2D.codeToExtent(codes[i])
      let polywkt = extentToWkt(extent)
      const grid = wktFormat.readFeature(polywkt)
      grid.setProperties({
        name: codes[i]
      })
      sourceGrid04.addFeature(grid)
    }
  }
  numGrids.value = textarea4.value.split(',').length
}
const extentToWkt = (extent) => {
  return `Polygon((${extent[0].lngDegree} ${extent[0].latDegree}, ${extent[0].lngDegree} ${extent[1].latDegree}, ${extent[1].lngDegree} ${extent[1].latDegree}, ${extent[1].lngDegree} ${extent[0].latDegree}, ${extent[0].lngDegree} ${extent[0].latDegree}))`
}
const handleChangeLevel = () => {
  handleInput01()
  handleInput03()
}
const handleAnalyse = () => {
  if(typeAna.value == '1') {
    if(textarea2.value == textarea4.value) {
      result.value = '相交'
    } else {
      result.value = '未相交'
    }

  } else if(typeAna.value == '2') {
    // todo
    if(textarea4.value.indexOf(textarea2.value) > -1) {
      result.value = '相交'
    } else {
      result.value = '未相交'
    }
  } else if(typeAna.value == '3') {
    // todo
    if(handleRelPointPolygon()) {
      result.value = '相交'
    } else {
      result.value = '未相交'
    }
  }
}
const handleChangeType = (val) => {
  typeAna.value = val
  textarea1.value = ''
  textarea2.value = ''
  textarea3.value = ''
  textarea4.value = ''
}
const handleRelPointPolygon = () => {
  // textarea1.value = textarea2.value
  // handleInput01()
  let res = false
  if(textarea4.value.indexOf(',') == -1) {
    if(textarea4.value == textarea2.value) {
      res = true
    } else {
      res = false
    }
  } else {
    //todo
  }
  return res
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

#tool-card {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  width: 500px;
}
</style>