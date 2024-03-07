/*
 * @Author: ChatGIS
 * @Description: 行政区划API
 */
import request from './request'


const base = '/gisarea'
export const addArea = (data: any) => {
    return request({
        url: base + '/addArea',
        method: 'post',
        data
    })
}