<script setup lang='ts'>
import getAssetsFile from '@/utils/sys-use'
import router from '@/router'
import { computed } from 'vue'
import menuBackground from '@/assets/image/menu-background.jpg'
import ImageProjectIcon from '@/assets/image/project_icon_transparent.png'

interface Menu {
    title: string;
    imgSrc: string;
    showRoute: string;
    desc: string;
}

// 所有菜单项
const allMenu = [{
    title: '基础地图',
    imgSrc: getAssetsFile('map1.png'),
    showRoute: '/map-base',
    desc: '基础高德地图展示，包括放大、缩小、定位等功能'
}, {
    title: '地图纠偏',
    imgSrc: getAssetsFile('menu_map_rectification.gif'),
    showRoute: '/map-rectification',
    desc: '纠偏高德底图；进行坐标转换'
}, {
    title: '测量工具',
    imgSrc: getAssetsFile('menu_measure_tool.gif'),
    showRoute: '/measure-tool',
    desc: '长度测量、面积测量'
}, {
    title: '地图卷帘',
    imgSrc: getAssetsFile('map_swipe.gif'),
    showRoute: '/map-swipe',
    desc: '基于canvas实现地图卷帘效果'
}, {
    title: '底图换色',
    imgSrc: getAssetsFile('menu_map_color.gif'),
    showRoute: '/map-color',
    desc: '切换底图瓦片颜色，快速呈现深蓝色、灰黑色等地图'
}, {
    title: '在线地图',
    imgSrc: getAssetsFile('map2.png'),
    showRoute: '/map-online',
    desc: '常用在线地图'
}, {
    title: '捕捉追踪',
    imgSrc: getAssetsFile('menu_draw_trace.gif'),
    showRoute: '/draw-trace',
    desc: '捕捉要素，追踪已有要素，快速绘制'
}, {
    title: 'GIS数据类型',
    imgSrc: getAssetsFile('menu_data_type.gif'),
    showRoute: '/data-type',
    desc: '通过编辑生成各类GIS数据类型，提供编辑、下载功能'
}, {
    title: 'HelloCesium',
    imgSrc: getAssetsFile('menu_hello_cesium.gif'),
    showRoute: '/hello-cesium',
    desc: 'Cesium基础功能'
}, {
    title: 'HelloCanvas',
    imgSrc: getAssetsFile('hello_canvas.png'),
    showRoute: '/hello-canvas',
    desc: 'Canvas基础'
}]

// 计算属性，拆为二维数组
const menus = computed(() => {
    const menuArr: Menu[][] = []
    allMenu.forEach((item: Menu, index: number) => {
        const row = Math.floor(index / 4)
        if (!menuArr[row]) {
            menuArr[row] = []
        }
        menuArr[row].push(item)
    })
    return menuArr
})
// 计算数量
const menuNum = computed(() => {
    return allMenu.length
})
// 跳转页面
const toPage = (route: string) => {
    router.push(route)
}
</script>

<template>
    <div id="menu-div" :style="'background-image:url(' + menuBackground + ')'">
        <el-image style="width: 100px; height: 100px" :src="ImageProjectIcon" fit="fill"/>
        <h1>功能菜单（{{ menuNum }}）</h1>
        <el-scrollbar>
            <el-row :gutter="20" justify="center" v-for="(items, index) in menus" :key="index">
                <el-col v-for="(item) in items" :key="item" :span="4">
                    <el-card :body-style="{ padding: '0px' }" @click="toPage(item.showRoute)" shadow="hover">
                        <img style="width:200px; height:100px" :src="item.imgSrc" class="image" />
                        <div class="info">
                            <span>{{ item.title }}</span>
                        </div>
                        <div class="desc">
                            <span>{{ item.desc }}</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-scrollbar>
    </div>
</template>

<style scoped>
#menu-div {
    /* background-image: url(); */
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
}

h1 {
    color: #FFFFFF;
}
.el-scrollbar {
    height: calc(100% - 85px);
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-row {
    margin: 10px 100px;
}

img {
    margin: 10px 5px 0;
}

.info {
    margin: 5px;
    font-weight: bold;
}

.desc {
    font-size: smaller;
    height: 50px;
}

.el-card {
    cursor: pointer;
}
/* 图片旋转 */
.el-image:hover {
    animation-play-state: paused;
}
.el-image {
    position: absolute;
    left: 20px;
    animation: rotate 10s linear infinite;
}
@keyframes rotate {
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(360deg);
    }
}
</style>