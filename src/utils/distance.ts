/* 
  * 计算点与点距离
  * param { String } lonlat 两个点的经纬度，形如：'120,30,121,31'
  * return { String} 返回值 
*/ 
function distancePtPt(lonlat: String){
    const lonlatsArr =  lonlat.split(",");
    const lon1:number = Number(lonlatsArr[0]);
    const lat1:number = Number(lonlatsArr[1]);
    const lon2:number = Number(lonlatsArr[2]);
    const lat2:number = Number(lonlatsArr[3]);
    
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lon1*Math.PI / 180.0 - lon2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10;  // 单位米
    return s;
}

export {distancePtPt}