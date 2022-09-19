<script setup lang='ts'>
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { ref, onMounted } from 'vue'
import mapMenu from '../../components/mapMenu/index.vue'

const map = ref();
const gaodeTileLayer = new TileLayer({
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
});

onMounted(() => {
    map.value = new Map({
        layers: [gaodeTileLayer
        ],
        target: 'map',
        view: new View({
            center: [117, 37],
            zoom: 10,
            projection: "EPSG:4326",
        })
    })
})

const mouseEnter = (e: any) => {
    console.log('mouseover')
    debugger
    return e
}

</script>

<template>
    <mapMenu id="mapMenu" :map="map"></mapMenu>
    <div id="weatherMenu">
        <div class="tooltipWeather" @mouseover="mouseEnter">
            <button>
                <svg width="9" height="20" viewBox="0 0 9 20" fill="#666666">
                    <path
                        d="M5 13.8672C5.18229 13.9323 5.35156 14.0234 5.50781 14.1406C5.66406 14.2578 5.79427 14.3945 5.89844 14.5508C6.00911 14.7005 6.09375 14.8698 6.15234 15.0586C6.21745 15.2409 6.25 15.4297 6.25 15.625C6.25 15.8854 6.20117 16.1296 6.10352 16.3574C6.00586 16.5853 5.8724 16.7839 5.70312 16.9531C5.53385 17.1224 5.33529 17.2559 5.10742 17.3535C4.87956 17.4512 4.63542 17.5 4.375 17.5C4.11458 17.5 3.87044 17.4512 3.64258 17.3535C3.41471 17.2559 3.21615 17.1224 3.04688 16.9531C2.8776 16.7839 2.74414 16.5853 2.64648 16.3574C2.54883 16.1296 2.5 15.8854 2.5 15.625C2.5 15.4297 2.5293 15.2409 2.58789 15.0586C2.65299 14.8698 2.73763 14.7005 2.8418 14.5508C2.95247 14.3945 3.08268 14.2578 3.23242 14.1406C3.38867 14.0234 3.5612 13.9323 3.75 13.8672V7.5H5V13.8672ZM7.5 12.8809C7.87109 13.291 8.16081 13.7467 8.36914 14.248C8.57747 14.7493 8.68164 15.2767 8.68164 15.8301C8.68164 16.416 8.56445 16.9629 8.33008 17.4707C8.10221 17.9785 7.78971 18.4212 7.39258 18.7988C6.99544 19.1699 6.53646 19.4629 6.01562 19.6777C5.49479 19.8926 4.94792 20 4.375 20C3.79557 20 3.24544 19.8926 2.72461 19.6777C2.21029 19.4629 1.75456 19.1699 1.35742 18.7988C0.960286 18.4212 0.644531 17.9785 0.410156 17.4707C0.182292 16.9629 0.0683594 16.416 0.0683594 15.8301C0.0683594 15.2767 0.172526 14.7493 0.380859 14.248C0.589193 13.7467 0.878906 13.291 1.25 12.8809V3.125C1.25 2.69531 1.33138 2.29167 1.49414 1.91406C1.6569 1.53646 1.87826 1.20768 2.1582 0.927734C2.44466 0.641276 2.77669 0.416667 3.1543 0.253906C3.53841 0.0846354 3.94531 0 4.375 0C4.80469 0 5.20833 0.0846354 5.58594 0.253906C5.96354 0.416667 6.29232 0.641276 6.57227 0.927734C6.85872 1.20768 7.08333 1.53646 7.24609 1.91406C7.41536 2.29167 7.5 2.69531 7.5 3.125V12.8809ZM4.375 18.75C4.77865 18.75 5.16276 18.6751 5.52734 18.5254C5.89844 18.3757 6.22396 18.1706 6.50391 17.9102C6.78385 17.6497 7.00521 17.3405 7.16797 16.9824C7.33724 16.6243 7.42188 16.2402 7.42188 15.8301C7.42188 15.3418 7.31445 14.8958 7.09961 14.4922C6.88477 14.082 6.60156 13.7142 6.25 13.3887V3.125C6.25 2.86458 6.20117 2.62044 6.10352 2.39258C6.00586 2.16471 5.8724 1.96615 5.70312 1.79688C5.53385 1.6276 5.33529 1.49414 5.10742 1.39648C4.87956 1.29883 4.63542 1.25 4.375 1.25C4.11458 1.25 3.87044 1.29883 3.64258 1.39648C3.41471 1.49414 3.21615 1.6276 3.04688 1.79688C2.8776 1.96615 2.74414 2.16471 2.64648 2.39258C2.54883 2.62044 2.5 2.86458 2.5 3.125V13.3887C2.14844 13.7142 1.86523 14.082 1.65039 14.4922C1.43555 14.8958 1.32812 15.3418 1.32812 15.8301C1.32812 16.2402 1.40951 16.6243 1.57227 16.9824C1.74154 17.3405 1.96615 17.6497 2.24609 17.9102C2.52604 18.1706 2.84831 18.3757 3.21289 18.5254C3.58398 18.6751 3.97135 18.75 4.375 18.75Z">
                    </path>
                </svg>

            </button>
            <span id="textQiwen">
                气温
            </span>
        </div>
        <div class="tooltipWeather">
            <button>1</button>
        </div>
        <div class="tooltipWeather">
            <button>1</button>
        </div>
    </div>
    <div id="map" class="map">
    </div>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}

#mapMenu {
    z-index: 1;
    position: absolute;
    top: 40px;
    left: 50px;
}

#weatherMenu {
    position: absolute;
    top: 100px;
    left: 50px;
    z-index: 1;
    display: flex;
}

.tooltipWeather {
    position: relative;
    border-radius: 6px;
    border: 0px;
}

.tooltipWeather button {
    width: 36px;
    height: 36px;
    padding: 0px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #FFFFFF ;
    border: 2px solid transparent;
    border-radius: 6px;
}
#textQiwen {
    visibility: hidden;
    background-color: #FFD02C;
    color: #666666;
    font-size: 14px;
    text-align: center;
    border-radius: 6px;
    padding: 5px 18px;
    position: absolute;
    top: 42px;
    white-space: nowrap;
    left: 0;
}
#textQiwen:before {
    content: "";
    position: absolute;
    top: -10px;
    left: 14px;
    margin-top: 0;
    border-width: 5px;
    border-style: solid;
    border-color: transparent;
    border-right-color: transparent;
    border-left-color: transparent;
    border-bottom-color: #FFD02C;
}
</style>