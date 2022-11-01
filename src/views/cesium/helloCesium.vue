<script setup lang='ts'>
import { Viewer } from 'cesium'
import { onMounted } from 'vue'

onMounted(() => {
    const viewer = new Viewer('cesiumContainer',{
        // scene3DOnly: true,
        // selectionIndicator: false
    })
    viewer.scene.debugShowFramesPerSecond = true
})

</script>

<template>
    <div id="cesiumContainer"></div>
</template>

<style scoped>

</style>