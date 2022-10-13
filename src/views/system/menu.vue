<script setup lang='ts'>
import getAssetsFile from '../../utils/sys-use'

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
}]

</script>

<template>
    <h1>功能菜单</h1>
    <el-row :gutter="20">
        <el-col v-for="(item, index) in menus" :key="item" :span="4">
            <el-card :body-style="{ padding: '0px' }">
                <div class="info">
                    <router-link :to="item.showRoute">{{item.title}}</router-link>
                </div>
                <img style="width:200px; height:100px" :src="item.imgSrc" class="image" />
                <div class="info desc">
                    <span>{{item.desc}}</span>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<style scoped>
img {
    margin: 10px 5px 0;
}

.info {
    margin: 5px;
}
.desc {
    font-size: smaller;
    height: 50px;
}
</style>