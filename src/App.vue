<!--
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2024-05-15 22:40:19
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-18 22:47:34
 * @FilePath: \GisShow\src\App.vue
 * @Description: 
-->

<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.meta.name" v-if="$route.meta.keepAlive"></component>
    </keep-alive>
    <component :is="Component" :key="$route.meta.name" v-if="!$route.meta.keepAlive"></component>
  </router-view>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /* margin-top: 60px; */
}
html,body {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>
