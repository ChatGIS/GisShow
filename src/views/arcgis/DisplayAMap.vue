<script setup lang='ts'>
    import Map from "@arcgis/core/Map";
    import WebMap from '@arcgis/core/WebMap'
    import MapView from '@arcgis/core/views/MapView'
    import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
    import { onMounted } from 'vue'
    onMounted(() => {
        const featureLayer = new FeatureLayer({
          url: "http://172.18.193.223:6080/arcgis/rest/services/wgpt/government/FeatureServer/0"
        });

        const webMap = new WebMap({
            portalItem: {
                // id: "aa1d3f80270146208328cf66d022e09c",
                id: "8dda0e7b5e2d4fafa80132d59122268c"
            },
            layers: [featureLayer]
        })

        const mapView = new MapView({
            container: "viewDiv",
            map: webMap,
            zoom: 10,
            center: [112.73092308033597, 37.66469795964315]
        })

        mapView.when(() => {
            console.log("地图加载成功")
        })
    }
    
)


</script>

<template>
    <div id="viewDiv">

    </div>
</template>

<style scoped>
    #viewDiv {
        padding: 0;
        margin: 0;
        height: 100%;
    }
</style>