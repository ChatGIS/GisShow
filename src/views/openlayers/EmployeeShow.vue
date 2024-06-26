<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import View from 'ol/View'
import { onMounted, reactive, ref } from 'vue'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Coordinate } from 'ol/coordinate'
import { Point } from 'ol/geom'
import { Icon, Text, Style, Fill, Circle, Stroke } from 'ol/style'
import getAssetsFile from '@/utils/sys-use'
import gisJson from '@/assets/gis_employee_out.json'
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay'

// 定义map
const mapParams = {
    center: [117.060907, 36.665866],
    zoom: 12
}
let zoom = ref(0)
let map = new Map({})
let popup = new Overlay({})
onMounted(() => {
    map = new Map({
        layers: [gaodeTileLayer, locateLayer],
        target: 'map',
        view: new View({
            center: mapParams.center,
            zoom: mapParams.zoom,
            projection: 'EPSG:4326',
        })
    })
    // 添加鼠标位置
    map.addControl(controlMousePosition)
    // 获取地图层级
    map.on('moveend', () => {
        zoom.value = Math.round(map.getView().getZoom() as number)
    })
    // 加载员工要素
    initEmployeeData()
    // 初始化弹框要素
    initPopup()
    // 点击拾取
    map.on('singleclick', function (e) {
        clickMap(e)
    })
})
/* 
    地图图层
*/
// 高德瓦片
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
})
// 定位图层
const locateSource = new VectorSource({})
const locateLayer = new VectorLayer({
    source: locateSource,
})
// 办公楼图层
const buildSource = new VectorSource({})
const buildLayer = new VectorLayer({
    source: buildSource,
})
/* 
    控件
*/
// 鼠标拾取位置坐标控件
const controlMousePosition = new MousePosition({
    coordinateFormat: createStringXY(6),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position') as HTMLElement
})

// 关闭弹框
const closePopup = () => {
    popup.setPosition(undefined)
    // closer.blur()
    return false
}

/* 
    样式
*/
// 定位点样式
const styleBuild = new Style({
    image: new Icon({
        src: getAssetsFile('building.png'),
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

// 动态创建样式
const createLabelStyle = (feature: any) => {
    return new Style({
        image: new Icon({
            src: getAssetsFile('locate-red.png'),
            size: [64, 64],
            offset: [-17, -5]
        }),
        text: new Text({
            text: isShowName.value ? feature.get('name') : isShowAddress.value ? feature.get('address') : '' ,
            font: '15px sans-serif',
            offsetX: 0,
            offsetY: -32,
            fill: new Fill({
                color: 'black'
            })
        })
    })
}
// 根据年限动态创建样式
const createLabelStyleWithYearLevel = (feature: any) => {
    let colorFill = '#2ca4a4'
    let radiusCircle = 7
    if(feature.get('yearLevel') === 1) {
        colorFill = '#0f1423'
        radiusCircle = 10
    } else if (feature.get('yearLevel') === 2) {
        colorFill = '#15559a'
        radiusCircle = 9
    } else if (feature.get('yearLevel') === 3) {
        colorFill = '#5698c3'
        radiusCircle = 8
    } else if (feature.get('yearLevel') === 4) {
        colorFill = '#fa7e23'
        radiusCircle = 7
    } else if (feature.get('yearLevel') === 5) {
        colorFill = '#de2a18'
        radiusCircle = 6
    } else if (feature.get('yearLevel') === 6) {
        colorFill = '#08f417'
        radiusCircle = 7
    }
    return new Style({
        image: new Circle({
            radius: radiusCircle,
            fill: new Fill({
                color: colorFill,
            })
        }),
        fill: new Fill({
            color: 'black',
        }),
        stroke: new Stroke({
            color: 'white',
            width: 2,
        }),
        text: new Text({
            text: isShowName.value ? feature.get('name') : isShowAddress.value ? feature.get('address') : '' ,
            font: '15px sans-serif',
            offsetX: 0,
            offsetY: 18,
            fill: new Fill({
                color: 'black'
            })
        })
    })
}

// 根据距离动态创建样式
const createLabelStyleWithDistance = (feature: any) => {
    let colorFill = '#a01b0a'
    let radiusCircle = 8
    // const distancekilometer = feature.get('distance')/1000
    const timeMin = feature.get('duration')/60
    if(timeMin > 60) {
        colorFill = '#a01b0a'
        radiusCircle = 7.5
    } else if (timeMin <= 60 && timeMin > 40) {
        colorFill = '#b7584c'
        radiusCircle = 7.5
    } else if (timeMin <= 40 && timeMin > 30) {
        colorFill = '#c69b02'
        radiusCircle = 7
    } else if (timeMin <= 30 && timeMin > 20) {
        colorFill = '#e8c64f'
        radiusCircle = 7
    } else if (timeMin <= 20 && timeMin > 10) {
        colorFill = '#459c50'
        radiusCircle = 6.5
    }else if (timeMin <= 10) {
        colorFill = '#017410'
        radiusCircle = 6.5
    }
    return new Style({
        image: new Circle({
            radius: radiusCircle,
            fill: new Fill({
                color: colorFill,
            })
        }),
        fill: new Fill({
            color: 'black',
        }),
        stroke: new Stroke({
            color: 'white',
            width: 2,
        }),
        text: new Text({
            text: isShowName.value ? feature.get('name') : isShowAddress.value ? feature.get('address') : '' ,
            font: '15px sans-serif',
            offsetX: 0,
            offsetY: 18,
            fill: new Fill({
                color: 'black'
            })
        })
    })
}

const featureBuild = new Feature({
    geometry: new Point(mapParams.center),
})
featureBuild.setStyle(styleBuild)
buildSource.addFeature(featureBuild)

// 加载员工要素
const initEmployeeData = () => {
    locateSource.clear()
    for (let i = 0; i < gisJson.length; i++) {
        let yearIn = ''
        let yearLevel = 0
        let lonlat = gisJson[i].lonlat as unknown as string
        const onboardingTime = gisJson[i].onboarding_time
        const isResign = gisJson[i].resign_time? true : false
        // 计算入职年限
        if(onboardingTime) {
            var new_date = new Date()
            var old_date = new Date(onboardingTime) //设置过去的一个时间点，"yyyy-MM-dd HH:mm:ss"格式化日期
            var difftime = Number(new_date) - Number(old_date) //计算时间差
            var year = Math.floor(difftime/(1000 * 60 * 60 * 24 * 365))
            var month = Math.floor((difftime%(1000 * 60 * 60 * 24 * 365))/(1000 * 60 * 60 * 24 * 31))
            yearIn = `${year}年${month}月`
            if(year >= 10) {
                yearLevel = 1
            } else if (year < 10 && year >= 6) {
                yearLevel = 2
            } else if (year < 6 && year >= 3) {
                yearLevel = 3
            } else if (year < 3 && year >= 1) {
                yearLevel = 4
            } else {
                yearLevel = 5
            }
        }
        if(isResign) {
            yearLevel = 6
        }
        // 没有地址，在一定范围内随机生成坐标
        if (!lonlat) {
            const basicLon = 117.005046
            const basicLat = 36.759642
            const operator1 = Math.random() > 0.5 ? '+' : '-'
            const operator2 = Math.random() > 0.5 ? '+' : '-'
            const lon = eval(basicLon + operator1 + '0.1 * Math.random() * Math.random()')
            const lat = eval(basicLat + operator2 + '0.01 * Math.random() * Math.random()')
            lonlat = lon + ',' + lat
        }
        const feature = new Feature({
            geometry: new Point(lonlat.split(',').map(Number) as Coordinate),
            id: gisJson[i].id,
            name: gisJson[i].name,
            department: gisJson[i].department,
            address: gisJson[i].address,
            onboarding_time: gisJson[i].onboarding_time,
            yearIn: yearIn,
            yearLevel: yearLevel,
            lonlat: gisJson[i].lonlat,
            distance: gisJson[i].distance,
            duration: gisJson[i].duration,
            resign_time: gisJson[i].resign_time
        })
        if(isShowWithYearLevel.value){
            feature.setStyle(createLabelStyleWithYearLevel(feature))
        } else if(isShowWithDistance.value) {
            feature.setStyle(createLabelStyleWithDistance(feature))
        } else {
            feature.setStyle(createLabelStyle(feature))
        }
        locateSource.addFeature(feature)
    }
}
const initPopup = () => {
    // 获取popup的dom对象
    var container = document.getElementById('popup')

    // 创建popup
    popup = new Overlay({
        element: container as HTMLElement,
        autoPan: true,
        positioning: 'bottom-center',
        stopEvent: true,
        // autoPanAnimation: {
        //     duration: 250
        // }
    })
    map.addOverlay(popup)

}
// 监听鼠标单击事件，点击feature后弹出popup
function clickMap(e: any) {
    var coordinate = e.coordinate
    const features = map.getFeaturesAtPixel(e.pixel)
    console.log(features)
    if (features.length > 0) {
        activeName.value = features[0].get('name')
        featurePanes.length = 0
        for (let i = 0; i < features.length; i++) {
            const feature: any = {}
            feature.id = features[i].get('id')
            feature.name = features[i].get('name')
            feature.department = features[i].get('department')
            feature.onboarding_time = features[i].get('onboarding_time')
            feature.resign_time = features[i].get('resign_time')
            feature.address = features[i].get('address')
            feature.lonlat = features[i].get('lonlat')
            feature.yearIn = features[i].get('yearIn')
            feature.yearLevel = features[i].get('yearLevel')
            feature.distance = features[i].get('distance')
            feature.duration = features[i].get('duration')
            featurePanes.push(feature)
        }
        popup.setPosition(coordinate)
    }
}

// 是否展示名称
const isShowName = ref(false)
// 是否展示地址
const isShowAddress = ref(false)
// 是否以工作年限展示
const isShowWithYearLevel = ref(false)
// 是否以通勤距离展示
const isShowWithDistance = ref(false)
// tab触发默认
const activeName = ref('first')
// tab要素内容
const featurePanes: any[] = reactive([])

// 名称展示切换
const toggleShowName = () => {
    if(isShowName.value && isShowAddress.value) {
        isShowAddress.value = false
    }
    initEmployeeData()
}
// 地址展示切换
const toggleShowAddress = () => {
    if(isShowName.value && isShowAddress.value) {
        isShowName.value = false
    }
    initEmployeeData()
}
// 展示形式切换
const toggleShowWithYearLevel = () => {
    if(isShowWithYearLevel.value) {
        isShowWithDistance.value = false
        map.removeLayer(buildLayer)
    }
    initEmployeeData()
}

const toggleShowWithDistance = () => {
    if(isShowWithDistance.value) {
        isShowWithYearLevel.value = false
        map.addLayer(buildLayer)
    } else {
        map.removeLayer(buildLayer)
    }
    initEmployeeData()
}
</script>

<template>
    <div id="zoom-level-now">当前级别：{{ zoom }}</div>
    <div id="map" class="map"></div>
    <el-card id="geocode-card">
        <span>展示名称</span>
        <el-switch v-model="isShowName" @change="toggleShowName" />
        <br/>
        <span>展示地址</span>
        <el-switch v-model="isShowAddress" @change="toggleShowAddress" />
        <br/>
        <span>工作年限</span>
        <el-switch v-model="isShowWithYearLevel" @change="toggleShowWithYearLevel" />
        <br/>
        <span>通勤距离</span>
        <el-switch v-model="isShowWithDistance" @change="toggleShowWithDistance" />
    </el-card>
    <div id="popup" class="ol-popup">
        <a id="popup-closer" class="ol-popup-closer" @click="closePopup"></a>
        <el-tabs v-model="activeName" type="card" class="demo-tabs">
            <el-tab-pane :label="item.name" :name="item.name" v-for="item in featurePanes" :key="item.id">
                <el-descriptions :column="2">
                    <el-descriptions-item label="编号:">{{ item.id }}</el-descriptions-item>
                    <el-descriptions-item label="姓名:">{{ item.name }}</el-descriptions-item>
                    <el-descriptions-item label="入职日期:">{{ item.onboarding_time }}</el-descriptions-item>
                    <el-descriptions-item label="入职年限:">{{ item.yearIn }}</el-descriptions-item>
                    <el-descriptions-item label="部门:" span="2">{{ item.department }}</el-descriptions-item>
                    <el-descriptions-item label="地址:" span="2">{{ item.address }}</el-descriptions-item>
                    <el-descriptions-item label="骑行距离:">{{ item.distance/1000 }}公里</el-descriptions-item>
                    <el-descriptions-item label="骑行时间:">{{ (item.duration/60).toFixed(2) }}分钟</el-descriptions-item>
                    <el-descriptions-item label="空间位置:" :span="2">{{ item.lonlat }}</el-descriptions-item>
                </el-descriptions>
            </el-tab-pane>
        </el-tabs>
    </div>
    <el-card id="legend-year" class="legend" v-show="isShowWithYearLevel">
        <el-row>
            <el-col :span="6"><div style="width: 20px; height: 20px; border-radius: 20px; background-color: #0f1423"/></el-col>
            <el-col :span="18"><span>>10年,终身挖矿</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 18px; height: 18px; border-radius: 18px; background-color: #15559a"/></el-col>
            <el-col :span="18"><span>6~10年,老韭菜</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 16px; height: 16px; border-radius: 16px; background-color: #5698c3"/></el-col>
            <el-col :span="18"><span>3~6年,骑驴找驴</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 14px; height: 14px; border-radius: 14px; background-color: #fa7e23"/></el-col>
            <el-col :span="18"><span>1~3年,骑驴找马</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 12px; height: 12px; border-radius: 12px; background-color: #de2a18"/></el-col>
            <el-col :span="18"><span>1年内,极不稳定</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 14px; height: 14px; border-radius: 14px; background-color: #2ca4a4"/></el-col>
            <el-col :span="18"><span>生辰不明</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 14px; height: 14px; border-radius: 14px; background-color: #08f417"/></el-col>
            <el-col :span="18"><span>已出坑</span></el-col>
        </el-row>
    </el-card>
    <el-card id="legend-distance" class="legend" v-show="isShowWithDistance">
        <el-row>
            <el-col :span="6"><div style="width: 15px; height: 15px; border-radius: 15px; background-color: #a01b0a"/></el-col>
            <el-col :span="18"><span>>60分钟,老北京</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 15px; height: 15px; border-radius: 15px; background-color: #b7584c"/></el-col>
            <el-col :span="18"><span>40~60,边缘人士</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 14px; height: 14px; border-radius: 14px; background-color: #c69b02"/></el-col>
            <el-col :span="18"><span>30~40,公电两难</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 14px; height: 14px; border-radius: 14px; background-color: #e8c64f"/></el-col>
            <el-col :span="18"><span>20~30,电车党</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 13px; height: 13px; border-radius: 13px; background-color: #459c50"/></el-col>
            <el-col :span="18"><span>10~20,天选电车</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div style="width: 14px; height: 14px; border-radius: 14px; background-color: #017410"/></el-col>
            <el-col :span="18"><span>10分内,天选打工</span></el-col>
        </el-row>
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

.ol-popup {
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px #FFC125);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 360px;
    max-width: 400px;
}

.ol-popup:after,
.ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}

.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}

.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
    color: red;
}

.ol-popup-closer:after {
    content: "✖";
}
.el-switch {
    margin-left: 10px;
}
.legend {
    width: 200px;
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 1;
}
.el-col {
    display: flex;
    align-items: center;
}
</style>