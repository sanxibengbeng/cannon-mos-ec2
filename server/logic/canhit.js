const process = require('process')
const laserWidth = process.env.LaserWidth || 0.6
const mosWidth = process.env.MosquetoWidth || 1.0

function canHitTarget (originX, originY, angle, targetX, targetY) {
  var newTargetX = targetX - originX
  var newTargetY = targetY - originY
  if (newTargetX == 0 && newTargetY == 0) {
    return true
  }

  if (newTargetX == 0 && angle == 90) {
    return true
  }

  if (newTargetY == 0 && (angle == 0|| angle==180)) {
    return true
  }

  var distance = Math.sqrt(newTargetX * newTargetX + newTargetY * newTargetY)
  var targetAngle = Math.atan(newTargetY/newTargetX)
  // 如果计算出来的targetAngle < 0 则表明角度大于90度
  if (targetAngle < 0) {
    targetAngle = Math.PI + targetAngle
  }
  // 发炮角度转换
  var shootAngle = angle * Math.PI/180

  var diffAngle = Math.abs(targetAngle - shootAngle)
  // 角度相差超过90度以上，判定不命中
  if (diffAngle >= 0.5 *Math.PI) {
    return false
  }
  var targetDisToPath = distance * Math.sin(diffAngle)
  //console.log("shoot param", originX, originY, angle, targetX, targetY)
  //console.log('width', laserWidth, mosWidth, 'angles', targetAngle/Math.PI * 180, angle, diffAngle/Math.PI*180, "x and y", newTargetX, newTargetY, targetDisToPath)
  return targetDisToPath <= (laserWidth/2 + mosWidth/2)
}

module.exports= canHitTarget