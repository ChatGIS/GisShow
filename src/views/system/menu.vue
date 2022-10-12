<script setup lang='ts'>
const menus = [{
    title: '基础地图',
    imgSrc: 'src/assets/image/map1.png',
    showRoute: '/olmap'
}, {
    title: '底图换色',
    imgSrc: 'src/assets/image/map2.png',
    showRoute: '/colormap'
}]
</script>

<template>
    <h1>功能菜单</h1>
    <el-row :gutter="20">
        <el-col v-for="(item, index) in menus" :key="item" :span="4">
            <el-card :body-style="{ padding: '0px' }">
                <img style="width:200px; height:100px" :src="item.imgSrc" class="image" />
                <div class="info">
                    <router-link :to="item.showRoute">{{item.title}}</router-link>
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
</style>