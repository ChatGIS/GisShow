<template>
  <div id="zoom-level-now">当前级别：{{ zoom }}</div>
  <div id="map" class="map"></div>
  <el-card id="tool-card">
    <el-button type="primary" round @click="handleGetPointGrid">获取顶点一级网格码</el-button>
    <el-button type="primary" round @click="handleGetPointGridComboCode">获取下一级组合码</el-button>
    <br><span>层级：{{ numLevel }}</span>
    <br><span>内部网格数：{{ numIn }}</span>
    <br><span>边界网格数：{{ numBian }}</span>
    <br><span>点网格：{{ pointCode }}</span>
    <br><span>分析结果：{{ result }}</span>
    <el-input v-model="textarea1" style="width: 100%" :rows="5" type="textarea" placeholder="输入wkt"/>
    <el-input v-model="textarea5" style="width: 100%" :rows="5" type="textarea" placeholder="输入wkt"/>
    <el-input v-model="inCodeText" style="width: 100%" :rows="5" type="textarea" placeholder="输入wkt"/>
    <el-input v-model="bianCodeText" style="width: 100%" :rows="5" type="textarea" placeholder="输入wkt"/>
  </el-card>
</template>
<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Style, Fill, Text, Stroke, Circle } from 'ol/style'
import { MousePosition, ScaleLine } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { onMounted, ref, reactive } from 'vue'
import gcjMecator from '@/utils/gcj02ToWgs84.js'
import EntityCode2d from '@/utils/beidou/EntityCode2d'
import { Codec2D, Codec3D } from '@/utils/beidou/index'
import { WKT } from 'ol/format'
import * as turf from '@turf/turf'
import { gridCount1 } from '@/utils/beidou/data'

const wktFormat = new WKT()
const textarea1 = ref('POINT(117.030594 36.67481)')
const textarea5 = ref('POLYGON((117.030589 36.675099,117.030099 36.674819,117.030207 36.674103,117.03132 36.674383,117.031085 36.674986,117.030589 36.675099))')
const inCodeText = ref('')
const bianCodeText = ref('')
const result = ref('')
const pointCode = ref('')

// 定义map
let map = new Map({})
const mapObj = {
  center: [117.024, 36.676],
  zoom: 9
}
let zoom = ref(0)
let numLevel = ref(1)
let numIn = ref(0)
let numBian = ref(0)
const sourceGridBian = new VectorSource({})
const layerGridBian = new VectorLayer({
  source: sourceGridBian,
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
const sourcePolygon = new VectorSource({})
const layerPolygon = new VectorLayer({
  source: sourcePolygon,
  style: (feature) => {
    return new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 1)'
      }),
      text: new Text({
        text: feature.get('name')
      })
    })
  }
})
const sourceGridIn = new VectorSource({})
const layerGridIn = new VectorLayer({
  source: sourceGridIn,
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
const sourceGrid05 = new VectorSource({})
const layerGrid05 = new VectorLayer({
  source: sourceGrid05,
  style: (feature) => {
    return new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.3)'
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 0.9)'
      }),
      text: new Text({
        text: feature.get('name')
      })
    })
  }
})
const sourcePoint = new VectorSource({})
const layerPoint = new VectorLayer({
  source: sourcePoint,
  style: (feature) => {
    return new Style({
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.3)'
      }),
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 0.9)'
      }),
      text: new Text({
        text: feature.get('name')
      })
    })
  }
})
onMounted(() => {
  map = new Map({
    layers: [gaodeTileLayer, layerGrid02, layerGridIn, layerGridBian, layerPolygon, layerGrid05, layerPoint],
    target: 'map',
    view: new View({
      center: mapObj.center,
      zoom: mapObj.zoom,
      projection: 'EPSG:4326',
    }),
    controls: [
      new ScaleLine({
        units: 'metric'
      })
    ]
  })
  // 添加鼠标位置
  map.addControl(controlMousePosition)
  // 获取地图层级
  map.on('moveend', () => {
    zoom.value = Math.round(map.getView().getZoom())
  })
  // handleInput03()
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

const extentToWkt = (extent) => {
  return `Polygon((${extent[0].lngDegree} ${extent[0].latDegree}, ${extent[0].lngDegree} ${extent[1].latDegree}, ${extent[1].lngDegree} ${extent[1].latDegree}, ${extent[1].lngDegree} ${extent[0].latDegree}, ${extent[0].lngDegree} ${extent[0].latDegree}))`
}
const handleRelPointPolygon = (p1, x0, x1, y0, y1) => {
  let res = false
  const rx0 = getRelation(p1, x0, 1)
  const rx1 = getRelation(p1, x1, 2)
  const ry0 = getRelation(p1, y0, 3)
  const ry1 = getRelation(p1, y1, 4)
  
  if(rx0 & rx1 && ry0 & ry1) {
    res = true
  }
  return res
}
const getSameGridLevel = (code1, code2) => {
  let length = 0
  for (let i = 0; i < Math.min(code1.length, code2.length); i++) {
    if (code1[i] === code2[i]) {
      length++
    } else {
      break
    }
  }
  return length
}
const getRelation = (code1, code2, direction) => {
  let length = getSameGridLevel(code1, code2)
  if(length == 0) {
    return false
  } else if (length == 1 || length == 2) {
    const mayuan23 = code1.substr(1, 2)
    if(parseInt(mayuan23) <= 30) {
      // 西半球
      if(direction == 1) {
        return parseInt(code1.substr(1, 2)) <= parseInt(code2.substr(1, 2))
      } else if (direction == 2) {
        return parseInt(code1.substr(1, 2)) >= parseInt(code2.substr(1, 2))
      }
    } else {
      // 东半球
      if(direction == 1) {
        return parseInt(code1.substr(1, 2)) >= parseInt(code2.substr(1, 2))
      } else if (direction == 2) {
        return parseInt(code1.substr(1, 2)) <= parseInt(code2.substr(1, 2))
      }
    }
  } else {
    if(direction == 1 || direction == 3) {
      return code1[length].charCodeAt(0) >= code2[length].charCodeAt(0)
    } else {
      return code1[length].charCodeAt(0) <= code2[length].charCodeAt(0)
    }     
  }
}
const handleGetPointGrid = () => {
  const polygon = wktFormat.readFeature(textarea5.value)
  sourcePolygon.clear()
  sourcePolygon.addFeature(polygon)

  const coors = polygon.getGeometry().getCoordinates()[0]
  const gridCodes = []
  sourceGridBian.clear()

  for(let i = 0; i < coors.length; i++) {
    let lngLatNE = {
      lngDegree: coors[i][0],
      latDegree: coors[i][1]
    }
    const gridCode = Codec2D.encode(lngLatNE, 1)
    if(gridCodes.indexOf(gridCode) == -1) {
      gridCodes.push(gridCode)
    } else {
      continue
    }
    let extent = Codec2D.codeToExtent(gridCode)
    let polywkt = extentToWkt(extent)
    const grid = wktFormat.readFeature(polywkt)
    grid.setProperties({
      name: gridCode
    })
    sourceGridBian.addFeature(grid)
  }
  bianCodeText.value = gridCodes.length > 1 ? gridCodes.join(',') : gridCodes[0]
}
const handleGetPointGridComboCode = () => {
  const inCodes = []
  const bianCodes = []
  sourcePoint.clear()
  sourceGridBian.clear()
  const bianCode = bianCodeText.value.split(',')
  for(let i = 0; i < bianCode.length; i++) {
    const code = bianCode[i]
    const childCodes = getChildGridCode(code)
    for(let j = 0; j < childCodes.length; j++) {
      const childCode = childCodes[j]
      if(getRelationGrid(textarea5.value, childCode) == 1){
        inCodes.push(childCode)
        let extent = Codec2D.codeToExtent(childCode)
        let polywkt = extentToWkt(extent)
        const grid = wktFormat.readFeature(polywkt)
        grid.setProperties({
          name: childCode
        })
        sourceGridIn.addFeature(grid)
      } else if(getRelationGrid(textarea5.value, childCode) == 2){
        bianCodes.push(childCode)
        let extent = Codec2D.codeToExtent(childCode)
        let polywkt = extentToWkt(extent)
        const grid = wktFormat.readFeature(polywkt)
        grid.setProperties({
          name: childCode
        })
        sourceGridBian.addFeature(grid)
      }
      
    }
  }
  inCodeText.value = inCodeText.value ?  inCodeText.value + ',' + inCodes.join(',') : inCodes.join(',')
  bianCodeText.value = bianCodes.join(',')
  numIn.value = inCodeText.value.split(',').length
  numBian.value = bianCodeText.value.split(',').length

  const coors =  textarea1.value.split('(')[1].split(')')[0].split(' ').map(a => parseFloat(a))
  let lngLatNE = {
    lngDegree: coors[0],
    latDegree: coors[1]
  }
  const gridCode = Codec2D.encode(lngLatNE, numLevel.value)
  let extent = Codec2D.codeToExtent(gridCode)
  let polywkt = extentToWkt(extent)
  const grid = wktFormat.readFeature(polywkt)
  grid.setProperties({
    name: gridCode
  })
  sourcePoint.addFeature(grid)
  pointCode.value = gridCode
  if(result.value == '' || result.value == '在网格边界') {
    result.value = getRelationResult()
  }
}
const getChildGridCode = (code) => {
  const level = Codec2D.getCodeLevel(code)
  const childLevel = level + 1
  numLevel.value = childLevel
  const childCode = []
  switch(childLevel) {
  case 2:
  case 4:
  case 5:
  case 7:
  case 8:
  case 9:
  case 10:
    // eslint-disable-next-line no-case-declarations
    let count = gridCount1[childLevel]
    for(let i = 0; i < count[0]; i++) {
      for(let j = 0; j < count[1]; j++) {
        childCode.push(code + i.toString(16).toUpperCase() + j.toString(16).toUpperCase())
      }
    }
    break
  case 3:
  case 6: {
    const count = gridCount1[childLevel][0] * gridCount1[childLevel][1]
    for(let i = 0; i < count; i++) {
      childCode.push(code + i.toString())
    }
    break
  }
  }
  return childCode
}
const getTurfGridPolygonByCode = (code) => {
  let extent = Codec2D.codeToExtent(code)
  let polywkt = extentToWkt(extent)
  const grid = wktFormat.readFeature(polywkt)
  return turf.polygon(grid.getGeometry().getCoordinates())
}
const getRelationGrid = (wkt, code) => {
  const turfGrid = getTurfGridPolygonByCode(code)
  const turfPolygon = turf.polygon(wktFormat.readFeature(wkt).getGeometry().getCoordinates())
  const isContain = turf.booleanContains(turfPolygon, turfGrid)
  if(isContain) {
    return 1
  }
  const isIntersect = turf.booleanIntersects(turfPolygon, turfGrid)
  if(isIntersect) {
    return 2
  }
}
const getRelationResult = () => {
  if(bianCodeText.value.indexOf(pointCode.value) > -1) {
    return '在网格边界'
  } else if(inCodeText.value.indexOf(pointCode.value) > -1) {
    return '在网格内'
  } else {
    return '不在网格内'
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