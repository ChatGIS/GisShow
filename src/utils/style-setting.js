import { Style, Icon, Circle as CircleStyle, Fill, RegularShape, Stroke } from 'ol/style'
import Color from 'ol/color'

const StyleSetting = {
    /* 设置图层样式 */
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
        if(settings.showStyle == 1) {
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
        }
    },
    /* 通用位图样式 */
    generalBitmapStyle(style, settings) {
        if(settings.bitmapStyle) {
            const image = new Icon({
                crossOrigin: 'anonymous',
                anchor: [-1.0 * parseFloat(settings.bitmapstyle.xoffset), -1.0 * parseFloat(settings.bitmapstyle.yoffset)],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 1,
                src: settings.bitmapstyle.imagename
            })
            style.setImage(image) 
        }
    },
    /* 通用点样式 */
    generalPointStyle(style, settings) {
        if (settings.shapeCode == '1') {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const _that = this
            //圆形
            const image = new CircleStyle({
                radius: parseFloat(settings.shapeSize),
                fill: new Fill({
                    // color: _that.colorHexToRgba(settings.fillColor, settings.opacity/100)
                    color: '#FF00FF'
                }),
                stroke: new Stroke({
                    width: settings.strokeWidth,
                    color: settings.strokeColor,
                })
            })
            style.setImage(image)
        } else if (settings.symbolpointstyle.sharp == '3') {
            //正三角形
            const image = new RegularShape({
                fill: new Fill({
                    color: settings.fillColor
                }),
                points: 3,
                radius: parseFloat(settings.shapeSize),
                angle: 0
            })
            style.setImage(image)
        } else {
            //箭头，四角星，五角星，六角星
            const points = parseInt(settings.symbolpointstyle.sharp)
            const image = new RegularShape({
                fill: new Fill({
                    color: settings.fillColor
                }),
                points: points,
                radius: parseFloat(settings.symbolpointstyle.point_size),
                radius2: 0.4 * parseFloat(settings.symbolpointstyle.point_size),
                angle: 0
            })
            style.setImage(image)
        }
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
        return rgb.replace(/RGB/, 'RGBA').replace(')', ',' + opacity + ')')
    },
}
export default StyleSetting