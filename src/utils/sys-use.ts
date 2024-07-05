/*
 * @Author: ChatGIS ChatGIS@outlook.com
 * @Date: 2022-10-23 22:44:04
 * @LastEditors: ChatGIS ChatGIS@outlook.com
 * @LastEditTime: 2024-07-18 22:50:49
 * @FilePath: \GisShow\src\utils\sys-use.ts
 * @Description: 
 */

// 获取assets静态资源
const getAssetsFile = (url: string) => {
  return new URL(`../assets/image/${url}`, import.meta.url).href
}
export default getAssetsFile