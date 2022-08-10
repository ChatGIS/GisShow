<script setup lang='ts'>
    import Map from 'ol/Map'
    // 接收父组件传值
    const props = defineProps({
        map: {
            type: Map
        }
    })
    // 缩小函数
    const zoomIn = () => {
        const view = props.map!.getView();
        const zoom = view.getZoom()!;
        view.setZoom(zoom - 1);
    }
    // 放大函数
    const zoomOut = () => {
        const view = (props.map as Map).getView();
        const zoom: number = view.getZoom()!;
        view.setZoom(zoom + 1);
    }
</script>

<template>
    <div>
        <el-button @click="zoomOut">放大</el-button>
        <el-button @click="zoomIn">缩小</el-button>
    </div>
</template>

<style scoped>
</style>