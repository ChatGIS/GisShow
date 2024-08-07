/*
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2024-01-30 22:40:44
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-18 22:50:28
 * @FilePath: \GisShow\src\utils\ol-style.js
 * @Description: 
 */

import { Style, Stroke } from 'ol/style'
/**
 * @description: 铁路线样式
 * @param {*} index 1是黑白色；2是红白色；
 * @return {*}
 */
export function getRailwayStyle(index) {
  let darkColor = '#191919'
  if(index == 1) {
    darkColor = '#191919'
  } else if (index == 2) {
    darkColor = '#C81919'
  }
  return  [
    new Style({
      stroke: new Stroke({
        color: darkColor,
        width: 4,
        lineCap: 'butt',
      }),
      zIndex: 20,
    }),
    new Style({
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 1)',
        width: 4,
        lineDash: [15, 15],
        lineCap: 'butt',
      }),
      zIndex: 21,
    }),
  ]
}