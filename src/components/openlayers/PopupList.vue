<!--
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2024-07-06 22:05:28
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-07 22:52:26
 * @FilePath: \GisShow\src\components\openlayers\PopupList.vue
 * @Description: 弹框组件
-->

<template>
    <div class="popup-container" id="popup-list">
        <div id="popup-header" class="popup-header">
            <div class="popup-title">景点列表</div>
            <i class="popup-close" @click="closePopup()">×</i>
        </div>
        <div class="popup-content" v-for="(item, index) in featureInfos" :key="index">
            <div v-if="index < 8">
                <span class="popup-item" @click="clickInfo(item)">{{ item.name }}</span>
            </div>
            <div v-else> <span class="popup-item-more">......</span></div>
        </div>
    </div>
</template>

<script setup>
import Overlay from 'ol/Overlay'
import { onMounted } from 'vue'

let overlay = null
defineProps({
  featureInfos: Array
})
const emits = defineEmits(['clickInfo', 'closePopup'])
onMounted(() => {
  overlay = new Overlay({
    element: document.getElementById('popup-list'),
    offset: [8, 8],
    className: 'popup-container',
  })
  overlay.setPosition(undefined)
})
/**
 * @description: 创建弹框
 * @param {*} coord
 * @param {*} map
 * @return {*}
 */
const createPopup = (coord, map) => {
  overlay.setPosition(coord)
  map.addOverlay(overlay)
}
/**
 * @description: 关闭弹框
 * @return {*}
 */
const closePopup =() => {
  overlay.setPosition(undefined)
  emits('closePopup')
}
/**
 * @description: 点击列表项
 * @param {*} info
 * @return {*}
 */
const clickInfo = (info) => {
  emits('clickInfo', info)
}
defineExpose({
  createPopup
})
</script>

<style scoped>
.popup-container {
    max-width: 300px;
    background: #32475dcc;
    border: 2px solid #44bc86;
    border-radius: 10px;
    padding: 0 10px 10px 10px;
    overflow: hidden;
    overflow-y: auto;
    font-size: 14px;
    z-index: 9999999;
}
.popup-item-more {
    color: white;
}
.popup-item {
    color: white;
    text-decoration: underline;
}
.popup-item:hover {
    cursor: pointer;
}
.popup-header {
    margin-bottom: 0;
    width: 100%;
    color: rgb(24, 228, 235);
    padding: 10px;
    background-size: 95%;
    font-weight: bold;
    font-size: 15px;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    vertical-align: middle;
}
.popup-header .popup-title {
    display: inline-block;
}
.popup-container .popup-close {
    color: rgb(24, 228, 235);
    font-weight: bold;
    font-size: 20px;
    margin-right: 10px;
    margin-left: 10px;
}
.popup-container .popup-close:hover {
    cursor: pointer;
}
.popup-content {
    text-align: left;
    margin: 10px 0;
    padding: 0 10px;
}
.popup-content span {
    display: inline;
}
.popup-content span.left_title {
    color: rgb(8, 224, 221);
    margin-right: 10px;
}
.popup-content span.right_value {
    font-weight: 540;
    color: white;
}
</style>
