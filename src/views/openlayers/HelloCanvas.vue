<script setup lang='ts'>
import { offset } from 'ol/sphere'
import { off } from 'process'
import { onMounted } from 'vue'

let cWidth: number, cHeight: number
let myCanvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
onMounted(() => {
    myCanvas = document.getElementById('my-canvas') as HTMLCanvasElement
    ctx = myCanvas.getContext('2d') as CanvasRenderingContext2D
    cWidth = myCanvas.width
    cHeight = myCanvas.height
    // draw()
})

const draw = () => {
    ctx.clearRect(0,0, cWidth, cHeight)

    ctx.fillStyle = 'rgb(200, 0, 0)'
    ctx.fillRect(10, 10, 55, 50)

    ctx.fillStyle = 'rgb(0, 0, 200, 0.5)'
    ctx.fillRect(30, 30, 55, 50)
}
// 绘制矩形
const drawRectangle = () => {
    ctx.clearRect(0,0, cWidth, cHeight)

    ctx.fillRect(25, 25, 100, 100)
    ctx.clearRect(45, 45, 60, 60)
    ctx.strokeRect(50, 50, 50, 50)
}
// 绘制三角形
const drawTriangle = () => {
    ctx.clearRect(0,0, cWidth, cHeight)
    /* 
     当你调用 fill() 函数时，所有没有闭合的形状都会自动闭合，所以你不需要调用 closePath() 函数。
     但是调用 stroke() 时不会自动闭合。
    */
    // 填充三角形
    ctx.beginPath()
    ctx.moveTo(25, 25)
    ctx.lineTo(105, 25)
    ctx.lineTo(25, 105)
    ctx.fill()
    // 描边三角形
    ctx.beginPath()
    ctx.moveTo(125, 125)
    ctx.lineTo(125, 45)
    ctx.lineTo(45, 125)
    ctx.closePath()
    ctx.stroke()
}
// 绘制圆弧
const drawArc = () => {
    ctx.clearRect(0,0, cWidth, cHeight)

    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 3; j++) {
            ctx.beginPath()
            const x = 25 + j * 50
            const y = 25 + i * 50
            const radius = 20
            const startAngle = 0
            const endAngle = Math.PI + (Math.PI * j) / 2
            const anticlockwise = i % 2 == 0 ? false : true

            ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)

            if (i > 1) {
                ctx.fill()
            } else {
                ctx.stroke()
            }
        }
    }
}
// 绘制笑脸
const drawSmileyFace = () => {
    ctx.clearRect(0,0, cWidth, cHeight)

    ctx.beginPath()
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true)
    ctx.moveTo(110, 75)
    ctx.arc(75, 75, 35, 0, Math.PI, false)
    ctx.moveTo(65, 65)
    ctx.arc(60, 65, 5, 0, Math.PI * 2, true)
    ctx.moveTo(95, 65)
    ctx.arc(90, 65, 5, 0, Math.PI * 2, true)
    ctx.stroke()
}
// 通过二次贝塞尔曲线绘制对话气泡
const drawBubble = () => {
    ctx.clearRect(0,0, cWidth, cHeight)

    ctx.beginPath()
    ctx.moveTo(75, 25)
    ctx.quadraticCurveTo(25, 25, 25, 62.5)
    ctx.quadraticCurveTo(25, 100, 50, 100)
    ctx.quadraticCurveTo(50, 120, 30, 125)
    ctx.quadraticCurveTo(60, 120, 65, 100)
    ctx.quadraticCurveTo(125, 100, 125, 62.5)
    ctx.quadraticCurveTo(125, 25, 75, 25)
    ctx.stroke()
}
// 通过三次贝塞尔曲线绘制心形
const drawHeart = () => {
    ctx.clearRect(0,0, cWidth, cHeight)

    ctx.beginPath()
    ctx.moveTo(75, 40)
    ctx.bezierCurveTo(75, 37, 70, 25, 50, 25)
    ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5)
    ctx.bezierCurveTo(20, 80, 40, 102, 75, 120)
    ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5)
    ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25)
    ctx.bezierCurveTo(85, 25, 75, 37, 75, 40)
    ctx.fill()
}
// 使用Path2D函数进行绘制
const drawUsePath2D = () => {
    ctx.clearRect(0,0, cWidth, cHeight)

    const rectangle = new Path2D()
    rectangle.rect(10, 10, 50, 50)

    const circle = new Path2D()
    circle.moveTo(125, 125)
    circle.arc(100, 35, 35, 0, Math.PI * 2)

    const svg = new Path2D('M100 100 h 80 v 80 h -80 Z')

    ctx.fill(circle)
    ctx.stroke(rectangle)
    ctx.fill(svg)
}
// 通过fillStyle模拟调色板
const drawRectWithStyle = () => {
    ctx.clearRect(0,0, cWidth, cHeight)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            ctx.fillStyle = `rgb(${30 * i}, ${30 * j}, 100)`
            ctx.fillRect(20 * i, 20 * j, 20, 20)
        }
    }
}
// 绘制蚂蚁线
let offsetDashLine = 0
const drawAntLine = () => {
    offsetDashLine++
    if (offsetDashLine > 16) {
        offsetDashLine = 0
    }
    drawDashLine()
    setTimeout(drawAntLine, 100)
}
const drawDashLine = () => {
    ctx.clearRect(0,0, cWidth, cHeight)
    ctx.setLineDash([4, 2])
    ctx.lineDashOffset = -offsetDashLine
    ctx.strokeRect(10, 10, 100, 100)
}
</script>

<template>
    <h4>HelloCanvas</h4>
    <canvas id="my-canvas" width="500" height="300"></canvas>
    <div class="btn-container">
        <el-button type="primary" @click="drawRectangle">绘制矩形</el-button>
        <el-button type="primary" @click="drawTriangle">绘制三角形</el-button>
        <el-button type="primary" @click="drawArc">绘制圆弧</el-button>
        <el-button type="primary" @click="drawSmileyFace">绘制笑脸</el-button>
        <el-button type="primary" @click="drawBubble">贝塞尔气泡</el-button>
        <el-button type="primary" @click="drawHeart">贝塞尔心形</el-button>
        <el-button type="primary" @click="drawUsePath2D">使用Path2D</el-button>
    </div>
    <div class="btn-container">
        <el-button type="primary" @click="drawRectWithStyle">模拟调色板</el-button>
        <el-button type="primary" @click="drawAntLine">绘制蚂蚁线</el-button>
    </div>
</template>

<style scoped>
canvas {
    border: 1px solid black;
}

.btn-container {
    margin: 5px 0;
}
</style>