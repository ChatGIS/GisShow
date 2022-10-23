/* 
  * 计算点与点距离
  * param { String } lonlat 两个点的经纬度，形如：'120,30,121,31'
  * return { String} 返回值 
*/
function distancePtPt(lonlat: string) {
  const lonlatsArr = lonlat.split(",");
  const lon1 = Number(lonlatsArr[0]);
  const lat1 = Number(lonlatsArr[1]);
  const lon2 = Number(lonlatsArr[2]);
  const lat2 = Number(lonlatsArr[3]);

  const radLat1 = lat1 * Math.PI / 180.0;
  const radLat2 = lat2 * Math.PI / 180.0;
  const a = radLat1 - radLat2;
  const b = lon1 * Math.PI / 180.0 - lon2 * Math.PI / 180.0;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10;  // 单位米
  return s;
}

export { distancePtPt }