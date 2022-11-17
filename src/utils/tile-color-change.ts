import RasterSource from 'ol/source/Raster'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import ImageLayer from 'ol/layer/Image'

/* 
    * tileType, gaode
*/
function getColorLayer(tileType: any, color: any) {
    // 根据类型获取瓦片地址
    let tileUrl = '/gaodetile/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    if(tileType == 'gaode'){
        tileUrl = '/gaodetile/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    }
    // 创建瓦片图层
    const tileLayer = new TileLayer({
        source: new XYZ({
            // url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
            url: tileUrl
        })
    })

    //定义颜色转换方法
    let reverseFunc: any = undefined
    if (color == 'gray') {
        reverseFunc = function (pixelsTemp: any) {
            //灰色
            for (let i = 0; i < pixelsTemp.length; i += 4) {
                const r = pixelsTemp[i]
                const g = pixelsTemp[i + 1]
                const b = pixelsTemp[i + 2]
                //运用图像学公式，设置灰度值
                const grey = r * 0.3 + g * 0.59 + b * 0.11
                //将rgb的值替换为灰度值
                pixelsTemp[i] = grey
                pixelsTemp[i + 1] = grey
                pixelsTemp[i + 2] = grey
            }
        }
    } else if (color == 'blue') {
        reverseFunc = function (pixelsTemp: any) {
            //蓝色
            for (let i = 0; i < pixelsTemp.length; i += 4) {
                const r = pixelsTemp[i]
                const g = pixelsTemp[i + 1]
                const b = pixelsTemp[i + 2]
                //运用图像学公式，设置灰度值
                const grey = r * 0.3 + g * 0.59 + b * 0.11
                //将rgb的值替换为灰度值
                pixelsTemp[i] = grey
                pixelsTemp[i + 1] = grey
                pixelsTemp[i + 2] = grey

                pixelsTemp[i] = 55 - pixelsTemp[i]
                pixelsTemp[i + 1] = 255 - pixelsTemp[i + 1]
                pixelsTemp[i + 2] = 305 - pixelsTemp[i + 2]
            }
        }
    } else if (color == 'graygreen') {
        reverseFunc = function (pixelsTemp: any) {
            //灰绿
            for (let i = 0; i < pixelsTemp.length; i += 4) {
                const r = pixelsTemp[i]
                const g = pixelsTemp[i + 1]
                const b = pixelsTemp[i + 2]
                //运用图像学公式，设置灰度值
                const grey = r * 0.3 + g * 0.59 + b * 0.11
                //将rgb的值替换为灰度值
                pixelsTemp[i] = grey
                pixelsTemp[i + 1] = grey
                pixelsTemp[i + 2] = grey

                pixelsTemp[i] = 55 - pixelsTemp[i]
                pixelsTemp[i + 1] = 255 - pixelsTemp[i + 1]
                pixelsTemp[i + 2] = 255 - pixelsTemp[i + 2]
            }
        }
    } else if (color == 'black') {
        reverseFunc = function (pixelsTemp: any) {
            //灰黑色
            for (let i = 0; i < pixelsTemp.length; i += 4) {
                const r = pixelsTemp[i]
                const g = pixelsTemp[i + 1]
                const b = pixelsTemp[i + 2]
                //运用图像学公式，设置灰度值
                const grey = r * 0.3 + g * 0.59 + b * 0.11
                //将rgb的值替换为灰度值
                pixelsTemp[i] = grey
                pixelsTemp[i + 1] = grey
                pixelsTemp[i + 2] = grey

                //黑色，依赖上边的灰色
                pixelsTemp[i] = 255 - pixelsTemp[i]
                pixelsTemp[i + 1] = 255 - pixelsTemp[i + 1]
                pixelsTemp[i + 2] = 255 - pixelsTemp[i + 2]
            }
        }
    } else if (color == 'reversal') {
        reverseFunc = function (pixelsTemp: any) {
            //反转色
            for (let i = 0; i < pixelsTemp.length; i += 4) {
                pixelsTemp[i] = 255 - pixelsTemp[i]
                pixelsTemp[i + 1] = 255 - pixelsTemp[i + 1]
                pixelsTemp[i + 2] = 255 - pixelsTemp[i + 2]
            }
        }
    }

    if (reverseFunc) {
        const raster = new RasterSource({
            sources: [
                tileLayer,
            ],
            // 这里设置为image类型，与官方示例不同，优化速度
            operationType: 'image',
            operation: function (pixels: any, data) {
                //执行颜色转换方法，注意，这里的方法需要使用lib引入进来才可以使用
                reverseFunc(pixels[0].data)
                return pixels[0]
            },
            threads: 10,  //线程数量
            //允许operation使用外部方法
            lib: {  
                reverseFunc: reverseFunc,
            }

        })
        //创建新图层，注意，必须使用 ImageLayer
        const imageLayer = new ImageLayer({
            source: raster
        })
        return imageLayer
    } else {
        return tileLayer
    }
}
export default getColorLayer
