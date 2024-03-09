/*
 * @Author: Dreamice dreamice13@foxmail.com
 * @Date: 2022-10-23 17:44:04
 * @LastEditors: Dreamice dreamice13@foxmail.com
 * @LastEditTime: 2024-05-29 17:44:49
 * @FilePath: \GisShow\src\utils\sys-use.ts
 * @Description: 
 */
// 获取assets静态资源
const getAssetsFile = (url: string) => {
  return new URL(`../assets/image/${url}`, import.meta.url).href
}
export default getAssetsFile