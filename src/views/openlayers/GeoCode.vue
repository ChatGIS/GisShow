<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import View from 'ol/View'
import { onMounted, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import axios from 'axios'
import keyJson from '@/assets/private/private.json'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Coordinate } from 'ol/coordinate'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { Icon, Text, Style, Fill } from 'ol/style'
import getAssetsFile from '@/utils/sys-use'
import gisJson from '@/assets/gis_employee.json'
import saveAs from 'file-saver'

// 定义map
const mapObj = {
    center: [117.024, 36.676],
    zoom: 15
}
let zoom = ref(0)
let map = new Map({})
onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, locateLayer],
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
        zoom.value = Math.round(map.getView().getZoom() as number)
    })
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
    target: document.getElementById('mouse-position') as HTMLElement
})

// 定位图层
const locateSource = new VectorSource({})
const locateLayer = new VectorLayer({
    source: locateSource,
})
// 定位点样式
const styleLocate = new Style({
    image: new Icon({
        src: getAssetsFile('locate-red.png'),
        size: [64, 64],
        offset: [-17, -5]
    }),
    text: new Text({
        text: '',
        font: '15px sans-serif',
        offsetX: -3,
        offsetY: -32,
        fill: new Fill({
            color: 'red'
        })
    })
})
const address = ref('')
const lonlat = ref('')
// 清空函数
const clear = () => {
    address.value = ''
    lonlat.value = ''
}
// 地理编码
const geocode = () => {
    if(address.value) {
        const url = 'https://restapi.amap.com/v3/geocode/geo?address=' + address.value + '&key=' + keyJson.keyGaode
        axios.get(url).then(res => {
            if(res.status === 200){
                lonlat.value = res.data.geocodes[0].location
                const feature = new Feature(new Point(lonlat.value.split(',').map(Number) as Coordinate))
                feature.setStyle(styleLocate)
                locateSource.clear()
                locateSource.addFeature(feature)
                map.getView().setCenter(lonlat.value.split(',').map(Number) as Coordinate)
            }
        }).catch(err => {
            console.log(err)
        })
    } else {
        ElMessage('请输入地址！')
    }
}
// 地理编码百度
const geocodeBaidu = () => {
    if(address.value) {
        const url = '/baiduapi/geocoding/v3/?address='+address.value+'&output=json&ak='+keyJson.keyBaidu
        axios.get(url).then(res => {
            if(res.status === 200){
                lonlat.value = res.data.result.location.lng + ',' + res.data.result.location.lat
                const feature = new Feature(new Point(lonlat.value.split(',').map(Number) as Coordinate))
                feature.setStyle(styleLocate)
                locateSource.clear()
                locateSource.addFeature(feature)
                map.getView().setCenter(lonlat.value.split(',').map(Number) as Coordinate)
            }
        }).catch(err => {
            console.log(err)
        })
    } else {
        ElMessage('请输入地址！')
    }
}
// 地理编码天地图
const geocodeTianditu = () => {
    if(address.value) {
        const url = 'http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"'+ address.value +'"}&tk=' + keyJson.keyTianditu
        axios.get(url).then(res => {
            if(res.status === 200){
                lonlat.value = res.data.location.lon + ',' + res.data.location.lat
                const feature = new Feature(new Point(lonlat.value.split(',').map(Number) as Coordinate))
                feature.setStyle(styleLocate)
                locateSource.clear()
                locateSource.addFeature(feature)
                map.getView().setCenter(lonlat.value.split(',').map(Number) as Coordinate)
            }
        }).catch(err => {
            console.log(err)
        })
    } else {
        ElMessage('请输入地址！')
    }
}
// 逆地理编码
const reGeocode = () => {
    if(lonlat.value) {
        const url = 'https://restapi.amap.com/v3/geocode/regeo?location=' + lonlat.value + '&key=' + keyJson.keyGaode
        axios.get(url).then(res => {
            if(res.status === 200){
                address.value = res.data.regeocode.formatted_address
                const feature = new Feature(new Point(lonlat.value.split(',').map(Number) as Coordinate))
                feature.setStyle(styleLocate)
                locateSource.clear()
                locateSource.addFeature(feature)
                map.getView().setCenter(lonlat.value.split(',').map(Number) as Coordinate)
            }
        }).catch(err => {
            console.log(err)
        })
    } else {
        ElMessage('请输入经纬度！')
    }
}
// 批量编码
const temp = async() => {
    const json: any[] = gisJson.RECORDS
    for(let i = 0; i < json.length; i++) {
        if(!json[i].address) continue
        const url = 'https://restapi.amap.com/v3/geocode/geo?address=' + json[i].address + '&key=' + keyJson.keyGaode
        let res = await axios.get(url)
        if(res.status === 200){
            const ll = res.data.geocodes[0].location
            lonlat.value = ll
            console.log(ll)
            json[i].lonlat = ll
        }
        if(json[i].id === 98) continue
        const url2 = `https://restapi.amap.com/v4/direction/bicycling?origin=${json[i].lonlat}&destination=117.060907,36.665866&key=${keyJson.keyGaode}`
        let res2 = await axios.get(url2)
        if(res2.status === 200){
            const distance = res2.data.data.paths[0].distance
            const duration = res2.data.data.paths[0].duration
            json[i].distance = distance
            json[i].duration = duration
        }
    }
    var file = new File([JSON.stringify(json)], 'GeoCode.json', {type: 'text/plain;charset=utf-8'})
    saveAs(file)
}
</script>

<template>
    <div id="zoom-level-now">当前级别：{{zoom}}</div>
    <div id="map" class="map"></div>
    <el-card id="geocode-card">
        <el-input v-model="address" placeholder="地址" />
        <el-input v-model="lonlat" placeholder="坐标" />
        <el-button type="info" @click="clear">清空</el-button>
        <el-button type="primary" @click="geocode">地理编码(高德)</el-button>
        <el-button type="primary" @click="geocodeBaidu">地理编码(百度)</el-button>
        <el-button type="primary" @click="geocodeTianditu">地理编码(天地图)</el-button>
        <el-button type="primary" @click="reGeocode">逆地理编码</el-button>
        <el-button type="primary" @click="temp">临时</el-button>
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
}

#zoom-level-now {
    position: absolute;
    bottom: 20px;
    right: 200px;
    z-index: 1;
}

#geocode-card {
    position: absolute;
    top: 10px;
    left: 40px;
}
.el-input {
    margin-bottom: 10px;
}
</style>