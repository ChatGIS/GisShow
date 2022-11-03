/* eslint-disable @typescript-eslint/no-loss-of-precision */
const transCoor = (coor: Array<number>, fromCS: number, toCS: number) => {
    let coorTransed: Array<number> = []
    if (fromCS === toCS) {
        coorTransed = coor
    } else if (fromCS === 1 && toCS === 2) {
        coorTransed = transWgsToGcj(coor)
    } else if (fromCS === 2 && toCS === 1) {
        coorTransed = transGcjToWgs(coor)
    } else if (fromCS === 2 && toCS === 3) {
        coorTransed = transGcjToBd(coor)
    } else if (fromCS === 3 && toCS === 2) {
        coorTransed = transBdToGcj(coor)
    }
    return coorTransed
}
const PI = 3.14159265358979324
const X_PI = 3.14159265358979324 * 3000.0 / 180.0
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
    return { 'lat': dLat, 'lon': dLon }
}
// WGS-84 to GCJ-02
const gcj_encrypt = (wgsLat: number, wgsLon: number) => {
    if (outOfChina(wgsLat, wgsLon))
        return { 'lat': wgsLat, 'lon': wgsLon }
    const d = delta(wgsLat, wgsLon)
    return { 'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon }
}
// GCJ-02 to WGS-84 exactly
// 精确(二分极限法)
const gcj_decrypt_exact = (gcjLat: number, gcjLon: number) => {
    const initDelta = 0.01
    const threshold = 0.000000001	// var threshold = 0.000000001; 目前设置的是精确到小数点后9位，这个值越小，越精确，但是javascript中，浮点运算本身就不太精确，九位在GPS里也偏差不大了
    const dLat = initDelta, dLon = initDelta
    let mLat = gcjLat - dLat, mLon = gcjLon - dLon
    let pLat = gcjLat + dLat, pLon = gcjLon + dLon
    let wgsLat = 0
    let wgsLon = 0, i = 0
    // eslint-disable-next-line no-constant-condition
    while (1) {
        wgsLat = (mLat + pLat) / 2
        wgsLon = (mLon + pLon) / 2
        const tmp = gcj_encrypt(wgsLat, wgsLon)
        const dLat = tmp.lat - gcjLat
        const dLon = tmp.lon - gcjLon
        if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
            break

        if (dLat > 0) pLat = wgsLat; else mLat = wgsLat
        if (dLon > 0) pLon = wgsLon; else mLon = wgsLon

        if (++i > 10000) break
    }
    return { 'lat': wgsLat, 'lon': wgsLon }
}
// GCJ-02 to BD-09
const bd_encrypt = (gcjLat: number, gcjLon: number) => {
    const x = gcjLon, y = gcjLat
    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI)
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI)
    const bdLon = z * Math.cos(theta) + 0.0065
    const bdLat = z * Math.sin(theta) + 0.006
    return { 'lat': bdLat, 'lon': bdLon }
}
//BD-09 to GCJ-02
const bd_decrypt = (bdLat: number, bdLon: number) => {
    const x = bdLon - 0.0065, y = bdLat - 0.006
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
    const gcjLon = z * Math.cos(theta)
    const gcjLat = z * Math.sin(theta)
    return { 'lat': gcjLat, 'lon': gcjLon }
}
// WGS-84 to GCJ-02 支持多点转换
const transWgsToGcj = (coor: Array<number>) => {
    const returnArr = []
    for (let i = 0; i < coor.length; i = i + 2) {
        if (i + 2 > coor.length) continue
        const ll = gcj_encrypt(coor[i + 1], coor[i])
        returnArr.push(ll.lon)
        returnArr.push(ll.lat)
    }
    return returnArr
}
// GCJ-02 to WGS-84 exactly 支持多点转换
const transGcjToWgs = (coor: Array<number>) => {
    const returnArr = []
    const length = coor.length
    for (let i = 0; i < length; i = i + 2) {
        const ll = gcj_decrypt_exact(coor[i + 1], coor[i])
        returnArr.push(ll.lon)
        returnArr.push(ll.lat)
    }
    return returnArr
}
// GCJ-02 to BD-09 支持多点转换
const transGcjToBd = (coor: Array<number>) => {
    const returnArr = []
    const length = coor.length
    for (let i = 0; i < length; i = i + 2) {
        if (i + 2 > length) continue
        const lon = coor[i]
        const lat = coor[i + 1]
        const ll = bd_encrypt(lat, lon)
        returnArr.push(ll.lon)
        returnArr.push(ll.lat)
    }
    return returnArr
}
const transBdToGcj = (coor: Array<number>) => {
    const returnArr = []
    const length = coor.length
    for (let i = 0; i < length; i = i + 2) {
        if (i + 2 > length) continue
        const lon = coor[i]
        const lat = coor[i + 1]
        const ll = bd_decrypt(lat, lon)
        returnArr.push(ll.lon)
        returnArr.push(ll.lat)
    }
    return returnArr
}

export default transCoor