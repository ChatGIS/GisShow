import Projection from 'ol/proj/Projection'
import { addProjection, addCoordinateTransforms } from 'ol/proj'

var forEachPoint = function (func) {
  return function (input, opt_output, opt_dimension) {
    var len = input.length
    var dimension = opt_dimension || 2
    var output
    if (opt_output) {
      output = opt_output
    } else {
      if (dimension !== 2) {
        output = input.slice()
      } else {
        output = new Array(len)
      }
    }
    for (var offset = 0; offset < len; offset += dimension) {
      func(input, output, offset)
    }
    return output
  }
}
var gcj02 = {}
// var i = 0
var PI = Math.PI
var AXIS = 6378245.0
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
var OFFSET = 0.00669342162296594323 // (a^2 - b^2) / a^2

function delta(wgLon, wgLat) {
  var dLat = transformLat(wgLon - 105.0, wgLat - 35.0)
  var dLon = transformLon(wgLon - 105.0, wgLat - 35.0)
  var radLat = (wgLat / 180.0) * PI
  var magic = Math.sin(radLat)
  magic = 1 - OFFSET * magic * magic
  var sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / (((AXIS * (1 - OFFSET)) / (magic * sqrtMagic)) * PI)
  dLon = (dLon * 180.0) / ((AXIS / sqrtMagic) * Math.cos(radLat) * PI)
  return [dLon, dLat]
}

function outOfChina(lon, lat) {
  if (lon < 72.004 || lon > 137.8347) {
    return true
  }
  if (lat < 0.8293 || lat > 55.8271) {
    return true
  }
  return false
}

function transformLat(x, y) {
  var ret =
    -100.0 +
    2.0 * x +
    3.0 * y +
    0.2 * y * y +
    0.1 * x * y +
    0.2 * Math.sqrt(Math.abs(x))
  ret +=
    ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) /
    3.0
  ret +=
    ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0
  ret +=
    ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) *
      2.0) /
    3.0
  return ret
}

function transformLon(x, y) {
  var ret =
    300.0 +
    x +
    2.0 * y +
    0.1 * x * x +
    0.1 * x * y +
    0.1 * Math.sqrt(Math.abs(x))
  ret +=
    ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) /
    3.0
  ret +=
    ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0
  ret +=
    ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) *
      2.0) /
    3.0
  return ret
}

gcj02.toWGS84 = forEachPoint(function (input, output, offset) {
  var lng = input[offset]
  var lat = input[offset + 1]
  if (!outOfChina(lng, lat)) {
    var deltaD = delta(lng, lat)
    lng = lng - deltaD[0]
    lat = lat - deltaD[1]
  }
  output[offset] = lng
  output[offset + 1] = lat
})

gcj02.fromWGS84 = forEachPoint(function (input, output, offset) {
  var lng = input[offset]
  var lat = input[offset + 1]
  if (!outOfChina(lng, lat)) {
    var deltaD = delta(lng, lat)
    lng = lng + deltaD[0]
    lat = lat + deltaD[1]
  }
  output[offset] = lng
  output[offset + 1] = lat
})

var sphericalMercator = {}

var RADIUS = 6378137
var MAX_LATITUDE = 85.0511287798
var RAD_PER_DEG = Math.PI / 180

sphericalMercator.forward = forEachPoint(function (input, output, offset) {
  var lat = Math.max(Math.min(MAX_LATITUDE, input[offset + 1]), -MAX_LATITUDE)
  var sin = Math.sin(lat * RAD_PER_DEG)

  output[offset] = RADIUS * input[offset] * RAD_PER_DEG
  output[offset + 1] = (RADIUS * Math.log((1 + sin) / (1 - sin))) / 2
})

sphericalMercator.inverse = forEachPoint(function (input, output, offset) {
  output[offset] = input[offset] / RADIUS / RAD_PER_DEG
  output[offset + 1] =
    (2 * Math.atan(Math.exp(input[offset + 1] / RADIUS)) - Math.PI / 2) /
    RAD_PER_DEG
})

var projzh = {}
projzh.ll2gmerc = function (input, opt_output, opt_dimension) {
  const output = gcj02.fromWGS84(input, opt_output, opt_dimension)
  return projzh.ll2smerc(output, output, opt_dimension)
}
projzh.gmerc2ll = function (input, opt_output, opt_dimension) {
  const output = projzh.smerc2ll(input, input, opt_dimension)
  return gcj02.toWGS84(output, opt_output, opt_dimension)
}
projzh.smerc2gmerc = function (input, opt_output, opt_dimension) {
  let output = projzh.smerc2ll(input, input, opt_dimension)
  output = gcj02.fromWGS84(output, output, opt_dimension)
  return projzh.ll2smerc(output, output, opt_dimension)
}
projzh.gmerc2smerc = function (input, opt_output, opt_dimension) {
  let output = projzh.smerc2ll(input, input, opt_dimension)
  output = gcj02.toWGS84(output, output, opt_dimension)
  return projzh.ll2smerc(output, output, opt_dimension)
}

projzh.ll2smerc = sphericalMercator.forward
projzh.smerc2ll = sphericalMercator.inverse

// 合并
const gcj02Extent = [
  -20037508.342789244, -20037508.342789244, 20037508.342789244,
  20037508.342789244
]
const gcjMecator = new Projection({
  code: 'GCJ-02',
  extent: gcj02Extent,
  units: 'm'
})
addProjection(gcjMecator)
addCoordinateTransforms(
  'EPSG:4326',
  gcjMecator,
  projzh.ll2gmerc,
  projzh.gmerc2ll
)
addCoordinateTransforms(
  'EPSG:3857',
  gcjMecator,
  projzh.smerc2gmerc,
  projzh.gmerc2smerc
)

export default gcjMecator
