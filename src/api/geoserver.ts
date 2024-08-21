/*
 * @Author: ChatGIS
 * @Description: GeoServerAPI
 */
import request from './request-geoserver'

export const getFeatures = (typeName: any) => {
  return request({
    url: `/wfs?request=GetFeature&version=1.1.0&typeName=${typeName}&outputFormat=application/json`,
    method: 'get'
  })
}