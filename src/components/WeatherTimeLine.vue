<script setup lang='ts'>
import { onMounted } from 'vue'
import PauseImg from '../assets/image/pause.png'
import PlayImg from '../assets/image/play.png'

// 周期函数
let interval: any = null
let serial = 0
onMounted(() => {
    // 动态生成时间线时间文字
    function createTimeText () {
    for (let i = 0; i < 24; i++) {
        const showTime = Date.now() + 3600000 * i
        var spanElem = document.createElement('sapn')
        const hourText = new Date(showTime).getHours()
        if (hourText < 10) {
        spanElem.innerHTML = '&nbsp;&nbsp;&nbsp;' + new Date(showTime).getHours().toString()
        } else {
        spanElem.innerHTML = '&nbsp;&nbsp;' + new Date(showTime).getHours().toString()
        }
        //  + ':00'
        spanElem.id = 'timelineText' + i
        spanElem.className = 'timelineText' as string
        spanElem.title = showTime.toString()
        spanElem.style.flex = '1'
        spanElem.onclick = function (e) { textClick(e, new Date(showTime).getHours()) }
        document.getElementById('timelineText')!.append(spanElem)
        console.log(`1, ${document.getElementById('timelineText')}`)
    }
    }
    // 时间文本点击
    function textClick (e: any, time: any) {
    // 点击后字体颜色变化
    const className: any = e.target.className
    const elems = document.getElementsByClassName(className)
    for (let i = 0; i < elems.length; i++) {
        const htmlElement = elems[i] as HTMLElement
        htmlElement.style.fontWeight = 'normal'
    }
    e.target.style.fontWeight = 'bold'
    // 点击后按钮样式切换
    const elemImg = document.getElementById('timlineControlImg') as HTMLImageElement
    console.log(elemImg.src)
    if (elemImg.alt === '暂停') {
        // document.getElementById('timelineButton').innerHTML = '播放'
        elemImg.alt = '播放'
        elemImg.src = PlayImg
        window.clearInterval(interval)
    }
    // 点击后进度条长度
    const showTime = e.target.title
    serial = Math.round((showTime - Date.now()) / 3600000)
    const aHourWidth = document.getElementById('timelineBackground')!.offsetWidth / 23
    document.getElementById('timelineLine')!.style.width =
        aHourWidth * serial + 'px'
    }
    // playAuto(1000)
    createTimeText()
})

// 自动播放按钮
function playAuto (time: any) {
    const elemImg = document.getElementById('timlineControlImg') as HTMLImageElement
    if (elemImg.alt === '播放') {
    elemImg.src = PauseImg
    elemImg.alt = '暂停'
    elemImg.title = '暂停'
    interval = window.setInterval(function () {
        if (serial < 23) {
        serial = serial + 1
        } else {
        serial = 0
        }
        const aHourWidth = document.getElementById('timelineBackground')!.offsetWidth / 23
        document.getElementById('timelineLine')!.style.width = aHourWidth * serial + 'px'
    }, time)
    } else if (elemImg.alt === '暂停') {
    elemImg.src = PlayImg
    elemImg.alt = '播放'
    elemImg.title = '播放'
    if (interval) {
        window.clearInterval(interval)
    }
    }
}
</script>

<template>
    <div id="timeline">
    <div id="timelineControl">
        <img id="timlineControlImg" src="../../assets/image/map/timeline/play.png" alt="播放" title="播放" @click="playAuto(1000)">
        <!-- <button id="timelineButton" @click="playAuto(1000)">播放</button> -->
    </div>
    <div id="timelineShow">
        <div id="timelineBackground">
        <div id="timelineLine"></div>
        </div>
        <div id="timelineText"></div>
    </div>
    </div>
</template>

<style scoped>
#timeline {
    position: absolute;
    bottom: 10px;
    width: 90%;
    height: 30px;
    margin: 0 5%;
    display: flex;
    z-index: 1;
}
#timelineControl {
    width: 36px;
    margin-top: -4px;
}
#timelineShow {
    width: calc(100% - 36px);
}
#timelineBackground {
    width: calc(100% - 100% / 23);
    /* width: 100%; */
    height: 30%;
    background: #999999;
    border-radius: 8px;
    margin: 0 20px;
}
#timelineLine {
    width: 0px;
    height: 100%;
    border-radius: 8px;
    background: #ffd02c;
}
#timelineText {
    display: flex;
    color: #69f0c8;
}
</style>
    