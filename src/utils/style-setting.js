import { Style, Icon, Circle as CircleStyle, Fill, RegularShape, Stroke, Text } from 'ol/style'

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
    setLayerStyle(layerObj) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this
        
        const styleFunc = function(feature){
            const style = _that.generateStyle(feature, layerObj, 1)
            return style
        }
        layerObj.layer.setStyle(styleFunc)
    },
    
    /* 默认样式 */
    getDefaultShowStyle(feature) {
        return new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.1)'
            }),
            stroke: new Stroke({
                color: 'red'
            }),
            image: new CircleStyle({
                radius: 10,
                fill: new Fill({
                    color: 'rgba(255, 255, 0, 0.8)'
                })
            }),
            text: new Text({
                text: 'ceshi',
                font: '12px normal',
                fill: new Fill({
                    color: '#9932CC'
                }),
                offsetX: 5,
                offsetY: 5
            })
        })
    },
    /* 生成样式 */
    generateStyle(feature, layerObj, useType) {
        const settingLabel = layerObj.settingLabel
        const geometryType = layerObj.GeometryType
        let style = new Style({})
        const styleWidthLine = [new Style({}), new Style({})]   // 宽线样式
        if(geometryType == 'LINE') {
            style = styleWidthLine
        }
        if(useType == 1) {
            const styleType = layerObj.settingStyle.show.styleType
            const styleShowOne = layerObj.settingStyle.show.one
            if(styleType == 1) {
                this.generalOneStyle(feature, style, layerObj.settingStyle.show.one, settingLabel)
            } else if(styleType == 2) {
                const settingArray = layerObj.settingStyle.show.only
                if(settingArray.length > 0) {
                    const isMatch = this.generalOnlyStyle(feature, style, settingArray, settingLabel)
                    if(isMatch == 0) {
                        this.generalOneStyle(feature, style, styleShowOne, settingLabel)
                    }
                }
            } else if(styleType == 3) {
                const settingArray = layerObj.settingStyle.show.range
                if(settingArray.length > 0) {
                    const isMatch  = this.generalRangeStyle(feature, style, settingArray, settingLabel)
                    if(isMatch == 0) {
                        this.generalOneStyle(feature, style, styleShowOne, settingLabel)
                    }
                }
            }
        }
        return style
    }, 
    /* 通用标签 */
    generalLabel(feature, settings) {
        const labelText = feature.get(settings.columnName) + '' || ''
        const text = new Text({
            text: labelText,
            font: settings.fontSize + 'px ' + settings.fontType,
            offsetX: settings.textOffsetX,
            offsetY: settings.textOffsetY,
            fill: new Fill({
                color: this.colorHexToRgba(settings.textColor, settings.textOpacity/100),
            }),
        })
        return text
    },
    /* 通用单一样式 */
    generalOneStyle(feature, style, settingStyle, settingLabel) {
        const displayType = settingStyle.displayType
        if(displayType == 'BITMAPSTYLE') {
            this.generalBitmapStyle(feature, style, settingStyle, settingLabel)
        } else if(displayType == 'POINTSTYLE') {
            this.generalPointStyle(feature, style, settingStyle, settingLabel)
        } else if(displayType == 'LINESTYLE') {
            this.generalLineStyle(feature, style, settingStyle, settingLabel)
        } else if(displayType == 'POLYGONSTYLE') {
            this.generalPolygonStyle(feature, style, settingStyle, settingLabel)
        }
    },
    /* 通用唯一值分类样式 */
    generalOnlyStyle(feature, style, settingArray, settingLabel) {
        let isMatch = 0  // 是否在范围内
        for(let i = 0; i < settingArray.length; i++) {
            const filterColumnName = settingArray[0].filterColumn
            if(feature.get(filterColumnName) == settingArray[i].filterValue) {
                this.generalOneStyle(feature, style, settingArray[i], settingLabel)
                isMatch = 1
            }
        }
        return isMatch
    },
    /* 通用范围值分类样式 */
    generalRangeStyle(feature, style, settingArray, settingLabel) {
        let isMatch = 0  // 是否在范围内
        for(let i = 0; i < settingArray.length; i++) {
            const filterColumnName = settingArray[0].filterColumn
            const valueFea = feature.get(filterColumnName)
            const min = settingArray[i].filterMin
            const max = settingArray[i].filterMax
            if(valueFea > min && valueFea <= max) {
                this.generalOneStyle(feature, style, settingArray[i], settingLabel)
                isMatch = 1
            }
        }
        return isMatch
    },
    /* 通用位图样式 */
    generalBitmapStyle(feature, style, settingStyle, settingLabel) {
        const image = new Icon({
            crossOrigin: 'anonymous',
            anchor: [-1.0 * parseFloat(settingStyle.xOffset), -1.0 * parseFloat(settingStyle.yOffset)],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            opacity: settingStyle.opacity / 100,
            width: settingStyle.width,  // olV7.2.0开始支持icon的width和height
            height: settingStyle.height,
            src: settingStyle.srcIcon
        })
        style.setImage(image)
        if(settingLabel && settingLabel.columnName) {
            const text = this.generalLabel(feature, settingLabel)
            style.setText(text)
        }
    },
    /* 通用点样式 */
    generalPointStyle(feature, style, settingStyle, settingLabel) {
        if (settingStyle.shapeCode == '1') {
            //圆形
            const image = new CircleStyle({
                radius: parseFloat(settingStyle.shapeSize),
                fill: new Fill({
                    color: this.colorHexToRgba(settingStyle.fillColor, settingStyle.opacity/100)
                }),
                stroke: new Stroke({
                    width: settingStyle.strokeWidth,
                    color: this.colorHexToRgba(settingStyle.strokeColor, settingStyle.opacity/100)
                })
            })
            if(settingLabel && settingLabel.columnName) {
                const text = this.generalLabel(feature, settingLabel)
                style.setText(text)
            }
            style.setImage(image)
        } else if (settingStyle.shapeCode == '2') {
            //正三角形
            const image = new RegularShape({
                fill: new Fill({
                    color: this.colorHexToRgba(settingStyle.fillColor, settingStyle.opacity/100)
                }),
                stroke: new Stroke({
                    width: settingStyle.strokeWidth,
                    color: this.colorHexToRgba(settingStyle.strokeColor, settingStyle.opacity/100)
                }),
                points: 3,
                radius: parseFloat(settingStyle.shapeSize),
                angle: 0
            })
            style.setImage(image)
            if(settingLabel && settingLabel.columnName) {
                const text = this.generalLabel(feature, settingLabel)
                style.setText(text)
            }
        }  else if (settingStyle.shapeCode == '3') {
            // 正方形
            const image = new RegularShape({
                fill: new Fill({
                    color: this.colorHexToRgba(settingStyle.fillColor, settingStyle.opacity/100)
                }),
                stroke: new Stroke({
                    width: settingStyle.strokeWidth,
                    color: this.colorHexToRgba(settingStyle.strokeColor, settingStyle.opacity/100)
                }),
                points: 4,
                radius: parseFloat(settingStyle.shapeSize),
                angle: 0.79
            })
            style.setImage(image)
            if(settingLabel && settingLabel.columnName) {
                const text = this.generalLabel(feature, settingLabel)
                style.setText(text)
            }
        } else if (settingStyle.shapeCode == '4') {
            // 五角星
            const image = new RegularShape({
                fill: new Fill({
                    color: this.colorHexToRgba(settingStyle.fillColor, settingStyle.opacity/100)
                }),
                stroke: new Stroke({
                    width: settingStyle.strokeWidth,
                    color: this.colorHexToRgba(settingStyle.strokeColor, settingStyle.opacity/100)
                }),
                points: 5,
                radius: parseFloat(settingStyle.shapeSize),
                radius2: 0.4 * parseFloat(settingStyle.shapeSize),
            })
            style.setImage(image)
            if(settingLabel && settingLabel.columnName) {
                const text = this.generalLabel(feature, settingLabel)
                style.setText(text)
            }
        } 
    },
    /* 通用线样式 */
    generalLineStyle(feature, styles, settingStyle, settingLabel) {
        const strokeBottom = new Stroke({
            color: this.colorHexToRgba(settingStyle.strokeColor, settingStyle.opacity/100),
            width: settingStyle.width,
        })
        const strokeTop = new Stroke({
            color: this.colorHexToRgba(settingStyle.fillColor, settingStyle.opacity/100),
            width: settingStyle.width - settingStyle.strokeWidth * 2,
        })
        styles[0].setStroke(strokeBottom)
        styles[1].setStroke(strokeTop)
        if(settingLabel && settingLabel.columnName) {
            const text = this.generalLabel(feature, settingLabel)
            styles[0].setText(text)
        }
    },
    /* 通用面样式 */
    generalPolygonStyle(feature, style, settingStyle, settingLabel) {
        const fill = new Fill({
            color: this.colorHexToRgba(settingStyle.fillColor, settingStyle.opacity/100),
        })
        const stroke = new Stroke({
            color: this.colorHexToRgba(settingStyle.strokeColor, settingStyle.opacity/100),
            width: settingStyle.strokeWidth,
        })
        style.setFill(fill)
        style.setStroke(stroke)
        if(settingLabel && settingLabel.columnName) {
            const text = this.generalLabel(feature, settingLabel)
            style.setText(text)
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
        return rgb.replace(/RGB/, 'rgba').replace(')', ',' + opacity + ')')
    },
}
export default StyleSetting