/*
 * @Author: ChatGIS
 * @Description: 行政区划API
 */
import request from './request'


const base = '/gisarea'

export const getAreaByLevelCodeType = (level:any, code:any, type: any) => {
  return request({
    url: `${base}/getAreaByLevelAndCode?level=${level}&code=${code}&type=${type}`,
    method: 'get'
  })
}
export const addArea = (data: any) => {
  return request({
    url: base + '/addArea',
    method: 'post',
    data
  })
}
export const getProvince = (type: any) => {
  return request({
    url: base + '/getProvince?type=' + type,
    method: 'get'
  })
}