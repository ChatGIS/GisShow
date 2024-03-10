/*
 * @Author: ChatGIS
 * @Description: 级联选择框选项
 */
import { areaApi } from '@/api'

/**
 * @description: 获取级联选择框选项
 * @param {*} myLevel 2:地市、3:区县、4:乡镇、5:网格、6:楼宇
 * @return {*}
 */
export function getCascaderOption(myLevel, type) {
  let leafLevel = 1
  if (myLevel > 1) {
    leafLevel = myLevel - 1
  }
  return {
    lazy: true,
    // emitPath: false,
    checkStrictly: true,
    lazyLoad(node, resolve) {
      const { level, value } = node
      areaApi.getAreaByLevelCodeType(level + 1, value, type).then((data) => {
        const nodes = data.map((item) => {
          return {
            // level=4是网格,level=5是楼宇,使用id；行政区划使用code
            value: level < 4 ? item.code : item.id,
            label: item.name,
            leaf: level >= leafLevel
          }
        })
        resolve(nodes)
      })
    }
  }
}
