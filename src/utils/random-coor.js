/* 随机生成坐标 */
function randomCoordinates(longitude, latitude){
    const radius = 5000; // 半径
    const x0 = longitude;
    const y0 = latitude;

    // Convert Radius from meters to degrees.
    const rd = radius / 111300;

    const u = Math.random();
    const v = Math.random();

    let w = rd * Math.sqrt(u);
    let t = 2 * Math.PI * v;
    let x = w * Math.cos(t);
    let y = w * Math.sin(t);

    // Adjust the x-coordinate for the shrinking of the east-west distances
    const xp = x / Math.cos(y0);
    let newlatitude = y + y0;
    let newlongitude = xp + x0;
    return [newlongitude, newlatitude];
  }
  generateColorRamp() {
    const count = 1000;
    const stations = this.dataMock.stations;
    for (let j = 0; j < stations.length; j++) {
        for (let i = 0; i < count; ++i) {
        let newCoor = this.randomCoordinates(
            stations[j].geometry.coordinates[0],
            stations[j].geometry.coordinates[1]
        );
        features.push(new Feature(new Point(newCoor)));
        }
    }
    this.addDeviceToMap(features);
  }