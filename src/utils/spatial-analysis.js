import WKTReader from 'jsts/org/locationtech/jts/io/WKTReader'
import IsValidOp from 'jsts/org/locationtech/jts/operation/valid/IsValidOp'

export function isValid(lonlats) {
    const wkt = getPolygonWkt(lonlats)
    const aaa = new WKTReader()
    const jstsGeom = aaa.read(wkt)
    let isValidOp = new IsValidOp(jstsGeom)

    if (isValidOp.isValid()) {
        return true
    }
    return false
}

export function isPolygonInterChiasma(lonlats) {
    var lineArr = getLineGeosByLonlats(lonlats, true)
    //arr = getWktData(arr).split(",");
    //var isChiasma = false;
    var infoLev = 1
    for(var i=0, length=lineArr.length; i<length; i++){
        var clength = length
        if(i==0) clength = clength-1
        if(i+2<length){
            //var line1 = gcsp.util.getGeo(lineArr[i]);
            for(var j=i+2; j<clength; j++){
                var distance = lineArr[i].distance(lineArr[j])
                //if(distance < gcsp.util.jstsDistance){
                if(distance == 0){
                    var lonlat1 = getLonlatByGeom(lineArr[i])
                    var lonlat2 = getLonlatByGeom(lineArr[j])
                    if(isHaveSamePoint(lonlat1, lonlat2)){
                        infoLev = 3	
                    }else{
                        infoLev = 2
                        break
                    }
                    //isChiasma = true;
                    //console.log("begin");
                    //console.log(gcsp.util.getLonlatByGeom(lineArr[i]));
                    //console.log(gcsp.util.getLonlatByGeom(lineArr[j]));
                    //console.log("end");
                    //break;
                }
            }
        }
        if(infoLev == 2) break
    }
    //return isChiasma;
    return infoLev
}

function getLineGeosByLonlats(lonlats, isRemoveBeforePoint) {
    var isRemove = false
    if(isRemoveBeforePoint != undefined) isRemove = isRemoveBeforePoint
    var lineArr = []
    var arr = lonlats.split(',')
    if(isRemove) arr = removeSamePoint(arr)
    for(var i=0, length=arr.length; i<length; i=i+2){
        if((i+3)<length){
            lineArr.push(getGeo(arr[i]+','+arr[i+1]+','+arr[i+2]+','+arr[i+3]))
        }
    }
    return lineArr
}

function getLonlatByGeom(geo){
    var cors = geo.getCoordinates()
    var lonlats = []
    for(var i=0, length=cors.length; i<length; i++){
        lonlats.push(cors[i].x)
        lonlats.push(cors[i].y)
    }
    return lonlats.join(',')
}

function isHaveSamePoint(lonlat1, lonlat2) {
    var isSame = false
    var arr1 = lonlat1.split(',')
    var arr2 = lonlat2.split(',')
    for(var i=0, length=arr1.length; i<length; i=i+2){
        for(var j=0, jlength=arr2.length; j<length; j=j+2){
            if(arr1[i] == arr2[j] && arr1[i+1] == arr2[j+1]){
                isSame = true
                break
            }
        }
    }
    return isSame
}

function removeSamePoint(inpuOkLonlats, inpuNum){
    var num = (inpuNum==undefined?1:inpuNum)
    var okLonlats = inpuOkLonlats
    if(typeof inpuOkLonlats == 'string'){
        okLonlats = inpuOkLonlats.split(',')
    }
    var lonlats = []
    lonlats.push(okLonlats[0])
    lonlats.push(okLonlats[1])
    for(var j=2; j<okLonlats.length; j=j+2){
        if(!(okLonlats[j] == okLonlats[j-2] && okLonlats[j+1] == okLonlats[j-1])){
            lonlats.push(okLonlats[j])
            lonlats.push(okLonlats[j+1])
        }
    }
    if(num > 1){
        var tempLonlats = lonlats
        lonlats = []
        var step = 2*num
        var nextStep = step+1
        for(var i=0; i<tempLonlats.length; i=i+2){
            if((i+nextStep) < length){
                if(!(tempLonlats[i] == tempLonlats[i+step] && tempLonlats[i+1] == tempLonlats[i+nextStep])){
                    lonlats.push(okLonlats[i])
                    lonlats.push(okLonlats[i+1])
                }else if((tempLonlats[i] == tempLonlats[i+4] && tempLonlats[i+1] == tempLonlats[i+nextStep])){
                    lonlats.push(okLonlats[i])
                    lonlats.push(okLonlats[i+1])
                    var isCont = true
                    var count = 1
                    while(isCont){
                        var temIndex = i+count*step+1
                        if(temIndex < length){
                            if(tempLonlats[i] == tempLonlats[temIndex-1] && tempLonlats[i+1] == tempLonlats[temIndex]){
                                count++
                            }else{
                                isCont = false
                            }
                        }else{
                            isCont = false
                        }
                    }
                    i = temIndex-nextStep
                }
            }else{
                lonlats.push(okLonlats[i])
                lonlats.push(okLonlats[i+1])
            }
        }	
    }
    return lonlats
}

function getGeo(lonlats, isFace){
    const jstsReader = new WKTReader()
    var arr = lonlats
    if((typeof lonlats) == 'string')
        arr = lonlats.split(',')
    if(arr.length == 2){          
        return jstsReader.read(getPointWkt(arr))
    }else if(isFace == undefined || !isFace){
        return jstsReader.read(getLineStringWkt(arr))
    }else{
        return jstsReader.read(getPolygonWkt(arr))
    }
}

function getPointWkt(lonlats){
    return 'POINT('+getWktData(lonlats)+')'
}

function getLineStringWkt(lonlats){
    return 'LINESTRING('+getWktData(lonlats)+')'
}

function getPolygonWkt(lonlats){
    return 'POLYGON(('+getWktData(lonlats)+'))'
}

function getWktData(lonlats){
    var arr = lonlats
    if((typeof lonlats) == 'string')
        arr = lonlats.split(',')
    var dataArr = []
    for(var i=0, length=arr.length; i<length; i=i+2){
        dataArr.push(arr[i]+' '+arr[i+1])
    }
    return dataArr.join(',')
}