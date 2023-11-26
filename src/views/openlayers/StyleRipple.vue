<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer, Vector } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import View from 'ol/View'
import { onMounted, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { Geometry, Point } from 'ol/geom'
import { Feature, Overlay } from 'ol'
import { getVectorContext } from 'ol/render'
import { Style, Circle as CircleStyle, Stroke } from 'ol/style'
import RenderEvent from 'ol/render/Event'

// 定义map
const mapObj = {
    // center: [117.024, 36.676],
    center: [143.55, 39.50],
    zoom: 6
}
let zoom = ref(0)
let radiusRipple = 0
let opacityRipple = 1
let widthRipple = 4
var map = new Map({})
onMounted(() => {
    map = new Map({
        // layers: [gaodeTileLayer, layerPoint],
        layers: [gaodeTileLayer, layerTileRoadNetGaode],
        target: 'map',
        view: new View({
            center: mapObj.center,
            zoom: mapObj.zoom,
            projection: 'EPSG:4326',
        })
    })
    // 添加鼠标位置
    // map.addControl(controlMousePosition)
    // 获取地图层级
    map.on('moveend', () => {
        zoom.value = Math.round(map.getView().getZoom() as number)
    })
    // 水波效果1
    // layerPoint.on('postrender', rippleFun1)
    // 水波效果2
    // rippleFun2()

    rippleFun3()
})

// 高德瓦片
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
    })
})
// 高德路网瓦片图层
const layerTileRoadNetGaode = new TileLayer({
    source: new XYZ({
        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}'
    })
})
// 点图层
const featurePoint1 = new Feature({
    geometry: new Point(mapObj.center)
})
const layerPoint = new Vector({
    source: new VectorSource({
        features: [featurePoint1]
    })
})

// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position') as HTMLElement
})

// 水波扩散效果1
const rippleFun1 = (evt: RenderEvent) => {
    if(radiusRipple > 30) {
        radiusRipple = 0
        opacityRipple = 1
        widthRipple = 5
    }
    let ctx = getVectorContext(evt)
    ctx.setStyle(new Style({
        image: new CircleStyle({
            radius: radiusRipple,
            stroke: new Stroke({
                color: 'rgba(255, 0, 0, ' + opacityRipple + ')',
                width: widthRipple,
            }),
        })
    }))
    ctx.drawGeometry(featurePoint1.getGeometry() as Geometry)
    radiusRipple += 0.3
    opacityRipple -= 1/150
    widthRipple -= 4/100
    // map.render()
    layerPoint.changed()           
}

const rippleFun2 = () => {
    const ele = document.getElementById('div1') as HTMLElement
    const overlayPoint = new Overlay({
        element: ele,
        positioning: 'center-center'
    })
    overlayPoint.setPosition(mapObj.center)
    map.addOverlay(overlayPoint)
}

const rippleFun3 = () => {
    const ele = document.getElementById('div2') as HTMLElement
    const overlayPoint = new Overlay({
        element: ele,
        positioning: 'center-center'
    })
    overlayPoint.setPosition(mapObj.center)
    map.addOverlay(overlayPoint)
}
</script>

<template>
    <!-- <div id="zoom-level-now">当前级别：{{zoom}}</div> -->
    <div id="map" class="map"></div>
    <div id="div1" class="point_animation">
        <p></p>
        <span></span>
    </div>
    <div id="div2" class="css_animation"></div>
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

/* css水波效果1 */
.point_animation{
  background: #ff9900;
  width: 6px;
  height: 6px;
  border: 2px #ff9900 solid;
  border-radius: 50%;
  position: absolute;
 }
 
 .point_animation p, .point_animation span{
  position: absolute;
  width: 4px;
  height: 4px;
  animation: point_animation 1.5s infinite;
  box-shadow: 0px 0px 1px #ff9900;
  margin: 0px;
  border-radius: 50%;
 }
 .point_animation span{
  animation-delay: 1.8s;
 }
 @keyframes point_animation{
  10% {
  transform: scale(1);
  }
  100% {
  transform: scale(8);
  }
 }

 .css_animation{
    height:100px;
    width:100px;
    border-radius: 50px;
    background: rgba(255, 0, 0, 0.9);
    transform: scale(0);
    animation: mypoint 2s;
    animation-iteration-count: infinite;
 }
 @keyframes mypoint{
  to{
    transform: scale(1.5);
    background: rgba(0, 0, 0, 0);
  }
 }
</style>