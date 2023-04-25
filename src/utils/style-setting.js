import { Style, Icon, Circle as CircleStyle, Fill, RegularShape, Stroke } from 'ol/style'

const StyleSetting = {
    /* 设置图层样式 
     * layer: 图层
     * setting对象,示例如下：
     * const settings = {
        displayType: 'POINT',  // 呈现样式，POINT:几何图形、BITMAP:位图、LINE:线
        shapeCode: 4,  // 几何形状，1:圆、2:三角形、3:正方形、4:五角星
        shapeSize: 40,  // 图形大小
        opacity: 80,  // 透明度(0~100)
        fillColor: '#FF0000',  // 填充色(16进制颜色值)
        strokeColor: '#00FF00',  // 描边色(16进制颜色值)
        strokeWidth: 2,  // 描边宽度
        width: 30,  // 位图宽度
        height: 30,  // 位图高度
        xOffset: 30,  // 横向偏移
        yOffset: 30,  // 纵向偏移
        srcIcon: IconFlag  // 位图路径
       }
    */
    setLayerStyle(layer, settings) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this
        const styleFunc = function(feature){
            const style = _that.generalStyle(feature, settings)
            return style
        }
        layer.setStyle(styleFunc)
    },
    /* 通用样式 */
    generalStyle(feature, settings) {
        const style = new Style({})
        if(settings.isShowStyle == 1) {
            this.generalOneStyle(feature, style, settings)
        }
        return style
    },
    /* 设置通用单一样式 */
    generalOneStyle(feature, style, settings) {
        const displayType = settings.displayType
        if(displayType == 'BITMAP') {
            this.generalBitmapStyle(style, settings)
        } else if(displayType == 'POINT') {
            this.generalPointStyle(style, settings)
        } else if(displayType == 'LINE') {
            this.generalLineStyle(style, settings)
        }
    },
    /* 通用位图样式 */
    generalBitmapStyle(style, settings) {
        const image = new Icon({
            crossOrigin: 'anonymous',
            anchor: [-1.0 * parseFloat(settings.xOffset), -1.0 * parseFloat(settings.yOffset)],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            opacity: settings.opacity / 100,
            width: settings.width,  // olV7.2.0开始支持icon的width和height
            height: settings.height,
            src: settings.srcIcon
        })
        style.setImage(image) 
    },
    /* 通用点样式 */
    generalPointStyle(style, settings) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this
        if (settings.shapeCode == '1') {
            //圆形
            const image = new CircleStyle({
                radius: parseFloat(settings.shapeSize),
                fill: new Fill({
                    color: _that.colorHexToRgba(settings.fillColor, settings.opacity/100)
                }),
                stroke: new Stroke({
                    width: settings.strokeWidth,
                    color: _that.colorHexToRgba(settings.strokeColor, settings.opacity/100)
                })
            })
            style.setImage(image)
        } else if (settings.shapeCode == '2') {
            //正三角形
            const image = new RegularShape({
                fill: new Fill({
                    color: _that.colorHexToRgba(settings.fillColor, settings.opacity/100)
                }),
                stroke: new Stroke({
                    width: settings.strokeWidth,
                    color: _that.colorHexToRgba(settings.strokeColor, settings.opacity/100)
                }),
                points: 3,
                radius: parseFloat(settings.shapeSize),
                angle: 0
            })
            style.setImage(image)
        } else if (settings.shapeCode == '3') {
            // 正方形
            const image = new RegularShape({
                fill: new Fill({
                    color: _that.colorHexToRgba(settings.fillColor, settings.opacity/100)
                }),
                stroke: new Stroke({
                    width: settings.strokeWidth,
                    color: _that.colorHexToRgba(settings.strokeColor, settings.opacity/100)
                }),
                points: 4,
                radius: parseFloat(settings.shapeSize),
                angle: 0.79
            })
            style.setImage(image)
        } else if (settings.shapeCode == '4') {
            // 五角星
            const image = new RegularShape({
                fill: new Fill({
                    color: _that.colorHexToRgba(settings.fillColor, settings.opacity/100)
                }),
                stroke: new Stroke({
                    width: settings.strokeWidth,
                    color: _that.colorHexToRgba(settings.strokeColor, settings.opacity/100)
                }),
                points: 5,
                radius: parseFloat(settings.shapeSize),
                radius2: 0.4 * parseFloat(settings.shapeSize),
            })
            style.setImage(image)
        } 
    },
    /* 通用线样式 */
    generalLineStyle(style, settings) {
        style, settings
    },
    /* 十六进制颜色值转rgb */
    colorHexToRgb(colorHex) {
        var sColor = colorHex.toLowerCase()
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = '#'
                for (let i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
                }
                sColor = sColorNew
            }
            //处理六位的颜色值
            var sColorChange = []
            for (let i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
            }
            return 'RGB(' + sColorChange.join(',') + ')'
        }
        return sColor
    },
    /* 十六进制颜色值加透明度转rgba 
		opacity: 0~1
	*/
    colorHexToRgba(colorHex, opacity) {
        var rgb = this.colorHexToRgb(colorHex)
        return rgb.replace(/RGB/, 'rgba').replace(')', ',' + opacity + ')')
    },
}
export default StyleSetting