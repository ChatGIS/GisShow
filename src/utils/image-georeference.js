/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2023-08-01 15:37:09
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2023-08-02 15:54:03
 * @FilePath: \GisShow\src\utils\image-georeference.js
 * @Description: 
 */
import { DEFAULT_RADIUS } from 'ol/sphere'
import * as turf from '@turf/turf'

/**
 * @description: 获取图片中心点
 * @param {*} points
 * @return {*}
 */
export function getImageCenter(points) {
    let sumX = 0 
    let sumY = 0
    for (let point of points) {  
        sumX += point[0]
        sumY += point[1]
    }  
    return [sumX / points.length, sumY / points.length]
}
/**
 * @description: 获取图片水平范围
 * @param { Array } points
 * @return {*}
 */
export function getImageHorizontalExtent(points) {
    // 获取图片中心点坐标
    const center = getImageCenter(points)
    // 获取图片上下边界代表的实际距离
    const distanceTop = getDistance(points[0], points[1])
    const distanceBottom = getDistance(points[2], points[3])
    const distanceLeft = getDistance(points[0], points[3])
    const distanceRight = getDistance(points[1], points[2])
    const distanceH = (distanceTop + distanceBottom) / 2
    const distanceV = (distanceLeft + distanceRight) / 2
    // 获取图片水平放置时的extent
    const leftPoint = getEndPoint(center, distanceH / 2, 270)
    const rightPoint = getEndPoint(center, distanceH / 2, 90)
    const topPoint = getEndPoint(center, distanceV / 2, 0)
    const bottomPoint = getEndPoint(center, distanceV / 2, 180)
    return [leftPoint[0], bottomPoint[1], rightPoint[0], topPoint[1]]
}
/**
 * @description: 获取图片旋转角度
 * @param { Array } coor1 点坐标1
 * @param { Array } coor2 点坐标2
 * @return {*}
 */
export function getImageRotateRadian(coor1, coor2) {
    // 将经纬度转换为弧度
    var startLatInRadians = coor1[1] * (Math.PI / 180)
    var startLngInRadians = coor1[0] * (Math.PI / 180)
    var endLatInRadians = coor2[1] * (Math.PI / 180)
    var endLngInRadians = coor2[0] * (Math.PI / 180)

    // 计算两点之间的水平和垂直距离
    var deltaX = endLngInRadians - startLngInRadians
    var deltaY = endLatInRadians - startLatInRadians

    // 计算角度（单位：度）
    var angleInDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

    // 计算弧度
    var angleInRadians = Math.atan2(deltaY, deltaX)

    angleInDegrees = 180 - angleInDegrees
    angleInRadians = angleInDegrees * Math.PI / 180
    // 返回角度和弧度
    return angleInRadians
}
/**
 * @description: 获取距离
 * @param {*} coor1 点坐标1
 * @param {*} coor2 点坐标2
 * @return {*} 距离（单位米）
 */
function getDistance(coor1, coor2) {
    const lon1 = coor1[0]
    const lat1 = coor1[1]
    const lon2 = coor2[0]
    const lat2 = coor2[1]

    const radLat1 = lat1 * Math.PI / 180.0
    const radLat2 = lat2 * Math.PI / 180.0
    const a = radLat1 - radLat2
    const b = lon1 * Math.PI / 180.0 - lon2 * Math.PI / 180.0
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * DEFAULT_RADIUS
    return s
}
/**
 * @description: 获取终点坐标
 * @param { Array } start 起始点
 * @param { Number } distance 距离(米)
 * @param { Number } angle 角度
 * @return { Array } 终点坐标
 */
export function getEndPoint(start, distance, angle) {debugger
    const startLng = start[0]
    const startLat = start[1]
    // 将角度转换为弧度
    const angleInRadians = angle * (Math.PI / 180)
    // 将起始点的经纬度转换为弧度
    const startLatInRadians = startLat * (Math.PI / 180)
    const startLngInRadians = startLng * (Math.PI / 180)
    // 计算终点的纬度
    let endLat = Math.asin(Math.sin(startLatInRadians) * Math.cos(distance / DEFAULT_RADIUS) +
    Math.cos(startLatInRadians) * Math.sin(distance / DEFAULT_RADIUS) * Math.cos(angleInRadians))
    // 计算终点的经度
    let endLng = startLngInRadians + Math.atan2(Math.sin(angleInRadians) * Math.sin(distance / DEFAULT_RADIUS) * Math.cos(startLatInRadians),
        Math.cos(distance / DEFAULT_RADIUS) - Math.sin(startLatInRadians) * Math.sin(endLat))
    // 将弧度转换为角度
    endLat = endLat * (180 / Math.PI)
    endLng = endLng * (180 / Math.PI)
    // 返回终点的经纬度
    return [endLng, endLat]
}