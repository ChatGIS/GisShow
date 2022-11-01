<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang='ts'>
import getAssetsFile from '@/utils/sys-use'
import router from '@/router'

const menus = [{
    title: '基础地图',
    imgSrc: getAssetsFile('map1.png'),
    showRoute: '/olmap',
    desc: '基础高德地图展示，包括放大、缩小、定位等功能'
}, {
    title: '底图换色',
    imgSrc: getAssetsFile('map2.png'),
    showRoute: '/colormap',
    desc: '切换底图瓦片颜色，快速呈现深蓝色、灰黑色等地图'
}, {
    title: '捕捉追踪',
    imgSrc: getAssetsFile('drawtrace.gif'),
    showRoute: '/drawtrace',
    desc: '捕捉要素，追踪已有要素，快速绘制'
}, {
    title: 'GIS数据类型',
    imgSrc: getAssetsFile('datatype.gif'),
    showRoute: '/datatype',
    desc: '通过编辑生成各类GIS数据类型，提供编辑、下载功能'
}, {
    title: 'HelloCesium',
    imgSrc: getAssetsFile('datatype.gif'),
    showRoute: '/hellocesium',
    desc: 'Cesium基础功能'
}]
// 跳转页面
const toPage = (route: string) => {
    router.push(route)
}
</script>

<template>
    <div id="menu-div">
        <h1>功能菜单</h1>
        <el-row :gutter="20" justify="center">
            <el-col v-for="(item) in menus" :key="item" :span="4">
                <el-card :body-style="{ padding: '0px' }" @click="toPage(item.showRoute)" shadow="hover">
                    <img style="width:200px; height:100px" :src="item.imgSrc" class="image" />
                    <div class="info">
                        <span>{{item.title}}</span>
                    </div>
                    <div class="desc">
                        <span>{{item.desc}}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
#menu-div {
    background-image: url("assets/images/menu-background.jpg");
    width:100%;
    height:100%;
    position:fixed;
    background-size:100% 100%;
}
h1 {
    color: #FFFFFF;
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
    cursor:pointer;
}
</style>