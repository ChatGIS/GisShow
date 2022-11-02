/* eslint-disable @typescript-eslint/no-loss-of-precision */
const transCoor = (coor: Array<number>, fromCS: number, toCS: number) => {
    let coorTransed: Array<number> = []
    if(fromCS === toCS){
        coorTransed = coor
    } else if (fromCS === 1 && toCS === 2){
        coorTransed = transWgsToGcj(coor)
    }
    return coorTransed
}
const PI = 3.14159265358979324
// 判断坐标是否在国内
const outOfChina = (lat: number, lon: number) => {
    if (lon < 72.004 || lon > 137.8347)
        return true
    if (lat < 0.8293 || lat > 55.8271)
        return true
    return false
}
const transformLon = (x: number, y: number) => {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
    return ret
}
const transformLat = (x: number, y: number) => {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
    return ret
}

const delta = (lat: number, lon: number) => {
    // Krasovsky 1940
    const a = 6378245.0  // a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    const ee = 0.00669342162296594323   // ee: 椭球的偏心率。
    let dLat = transformLat(lon - 105.0, lat - 35.0)
    let dLon = transformLon(lon - 105.0, lat - 35.0)
    const radLat = lat / 180.0 * PI
    let magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    const sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
    return {'lat': dLat, 'lon': dLon}
}
// WGS-84 to GCJ-02
const gcj_encrypt = (wgsLat: number, wgsLon: number) => {
    if (outOfChina(wgsLat, wgsLon))
        return {'lat': wgsLat, 'lon': wgsLon}
    const d = delta(wgsLat, wgsLon)
    return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon}
}
// WGS-84 to GCJ-02 支持多点转换
const transWgsToGcj = (coor: Array<number>) => {
    const returnArr = []
    for(let i = 0; i < coor.length; i = i + 2){
        if(i + 2 > coor.length) continue
        const ll = gcj_encrypt(coor[i + 1], coor[i])
        returnArr.push(ll.lon)
        returnArr.push(ll.lat)
    }
    return returnArr
}
export default transCoor