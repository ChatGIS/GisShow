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
  <el-card id="tool-card1">
    <el-button type="primary" round @click="handleGetFourGridCode">获取四向网格</el-button>
    <el-button type="primary" round @click="handleGetFourGridCodeAuto">自动获取四向网格</el-button>
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="当前上">
        <el-input v-model="form.nowTop" />
      </el-form-item>
      <el-form-item label="当前下">
        <el-input v-model="form.nowBottom" />
      </el-form-item>
      <el-form-item label="当前左">
        <el-input v-model="form.nowLeft" />
      </el-form-item>
      <el-form-item label="当前右">
        <el-input v-model="form.nowRight" />
      </el-form-item>
      <el-form-item label="相交上(y1)">
        <el-input v-model="form.top" />
      </el-form-item>
      <el-form-item label="相交下(y0)">
        <el-input v-model="form.bottom" />
      </el-form-item>
      <el-form-item label="相交左(x0)">
        <el-input v-model="form.left" />
      </el-form-item>
      <el-form-item label="相交右(x1)">
        <el-input v-model="form.right" />
      </el-form-item>
    </el-form>
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
import { onMounted, ref, reactive } from 'vue'
import gcjMecator from '@/utils/gcj02ToWgs84.js'
import EntityCode2d from '@/utils/beidou/EntityCode2d'
import { Codec2D, Codec3D } from '@/utils/beidou/index'
import { WKT } from 'ol/format'

let interval = null
const typeAna = ref('1')
const result = ref('')
const textarea1 = ref('')
const textarea2 = ref('')
const textarea3 = ref('')
const textarea4 = ref('')
const numLevel = ref(4)
const numGrids = ref(0)
const form = reactive({
  nowTop: '@@',
  nowBottom: '@@',
  nowLeft: '@@',
  nowRight: '@@',
  top: '##',
  bottom: '##',
  left: '##',
  right: '##',
})
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
const sourceGrid06 = new VectorSource({})
const layerGrid06 = new VectorLayer({
  source: sourceGrid06,
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
    layers: [gaodeTileLayer, layerGrid02, layerGrid04, layerGrid01, layerGrid03, layerGrid05, layerGrid06],
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

    form.nowTop = textarea2.value
    form.nowBottom = textarea2.value
    form.nowLeft = textarea2.value
    form.nowRight = textarea2.value
    sourceGrid06.clear()
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
  form.top='##'
  form.bottom='##'
  form.left='##'
  form.right='##'
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
    if(handleRelPointPolygon(textarea2.value, form.left, form.right, form.bottom, form.top)) {
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
const handleRelPointPolygon = (p1, x0, x1, y0, y1) => {
  let res = false
  const rx0 = getRelation(p1, x0, 1)
  const rx1 = getRelation(p1, x1, 2)
  const ry0 = getRelation(p1, y0, 3)
  const ry1 = getRelation(p1, y1, 4)
  console.log(rx0, rx1, ry0, ry1, 'GisShow-12-10 16:58:13测试打印内容m')
  
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
const handleGetFourGridCode = () => {
  form.nowTop = Codec2D.getRelativeGrid(form.nowTop, 0, 1)
  form.nowBottom = Codec2D.getRelativeGrid(form.nowBottom, 0, -1)
  form.nowLeft = Codec2D.getRelativeGrid(form.nowLeft, -1, 0)
  form.nowRight = Codec2D.getRelativeGrid(form.nowRight, 1, 0)
  const nowFourGrid = [
    form.nowTop,
    form.nowBottom,
    form.nowLeft,
    form.nowRight
  ]
  const wktFormat = new WKT()
  sourceGrid05.clear()
  for(let i = 0; i < nowFourGrid.length; i++) {
    let extent = Codec2D.codeToExtent(nowFourGrid[i])
    let polywkt = extentToWkt(extent)
    const grid = wktFormat.readFeature(polywkt)
    grid.setProperties({
      name: nowFourGrid[i]
    })
    sourceGrid05.addFeature(grid)
  }
  if(form.top == '##' && textarea4.value.indexOf(form.nowTop) > -1) {
    form.top = form.nowTop
    let extent = Codec2D.codeToExtent(form.top)
    let polywkt = extentToWkt(extent)
    const grid = wktFormat.readFeature(polywkt)
    grid.setProperties({
      name: form.top
    })
    sourceGrid06.addFeature(grid)
  }
  if(form.bottom == '##' && textarea4.value.indexOf(form.nowBottom) > -1) {
    form.bottom = form.nowBottom
    let extent = Codec2D.codeToExtent(form.bottom)
    let polywkt = extentToWkt(extent)
    const grid = wktFormat.readFeature(polywkt)
    grid.setProperties({
      name: form.bottom
    })
    sourceGrid06.addFeature(grid)
  }
  if(form.left == '##' && textarea4.value.indexOf(form.nowLeft) > -1) {
    form.left = form.nowLeft
    let extent = Codec2D.codeToExtent(form.left)
    let polywkt = extentToWkt(extent)
    const grid = wktFormat.readFeature(polywkt)
    grid.setProperties({
      name: form.left
    })
    sourceGrid06.addFeature(grid)
  }
  if(form.right == '##' && textarea4.value.indexOf(form.nowRight) > -1) {
    form.right = form.nowRight
    let extent = Codec2D.codeToExtent(form.right)
    let polywkt = extentToWkt(extent)
    const grid = wktFormat.readFeature(polywkt)
    grid.setProperties({
      name: form.right
    })
    sourceGrid06.addFeature(grid)
  }
  if(form.top!= '##' && form.bottom!= '##' && form.left!= '##' && form.right!= '##') {
    clearInterval(interval)
  }
}
const handleGetFourGridCodeAuto = () => {
  interval = setInterval(() => {
    handleGetFourGridCode()
  }, 100)
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
#tool-card1 {
  position: absolute;
  top: 400px;
  left: 10px;
  z-index: 1;
  width: 500px;
}
</style>