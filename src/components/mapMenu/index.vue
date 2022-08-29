<script setup lang='ts'>
import { reactive, ref } from 'vue';
import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style'
import {Circle, Stroke, Fill} from 'ol/style'
import Icon from 'ol/style/Icon'
const formLabelWidth = '140px'
const dialogVisible = ref(false)
const form = reactive({
    lonlat: ''
})
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

// 定位函数
const locationShow = () => {
    const lonlatArr: number[] = [];
    lonlatArr.push(Number(form.lonlat.split(",")[0]))
    lonlatArr.push(Number(form.lonlat.split(",")[1]))
    props.map!.getView().setCenter(lonlatArr)

    // 定位样式
    const vectorLayer = new VectorLayer({
	  source: new VectorSource(),
	});
    vectorLayer.set('name', 'LocationLayer')
    // for(let i = 0; i < props.map?.getLayers().array_; i++){

    // }
    const feature = new Feature({
        geometry: new Point(lonlatArr)
    });
    var styleRed = new Style({
        image: new Icon({
            anchor: [15, 30],
            anchorXUnits: "pixels",
            anchorYUnits: "pixels",
            opacity: 1,
            src: "assets/images/location-red.png"
        })
    });
    var styleGreen = new Style({
        image: new Icon({
            anchor: [15, 30],
            anchorXUnits: "pixels",
            anchorYUnits: "pixels",
            opacity: 1,
            src: "assets/images/location-green.png"
        })
    });
    var style1 = new Style({
		image: new Circle({
			radius: 10,
			stroke: new Stroke({
				color: 'yellow',
				width: 0.5
			}),
			fill: new Fill({
				color: 'green'
			})
		})
	});
    let flag = 1;
	setInterval(function flashStyle(){
		if(flag == 1){
			feature.setStyle(styleRed);
			flag = 2;
		} else {
			feature.setStyle(styleGreen);
			flag = 1;
		 }
	},400);
    feature.setStyle(styleRed)
    vectorLayer.getSource()?.addFeature(feature)
    props.map?.addLayer(vectorLayer)
    dialogVisible.value = false
}
</script>

<template>
    <div>
        <el-button @click="zoomOut">放大</el-button>
        <el-button @click="zoomIn">缩小</el-button>
        <el-button @click="dialogVisible = true">定位</el-button>
        <el-dialog v-model="dialogVisible" title="定位">
            <span>输入坐标（格式：112.021334,37.346521）</span>
            <el-form :model="form">
                <el-form-item label="坐标" :label-width="formLabelWidth">
                    <el-input v-model="form.lonlat" autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="locationShow">定位</el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>

<style scoped>
</style>