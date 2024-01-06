const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = '#ff0000'  // 设置字体颜色为红色
    ctx.font = '60px Arial'    // 设置字体大小为原来的三倍

    const screenWidth = window.innerWidth
    const x = screenWidth / 2 - 20  // 设置分数显示在屏幕中间
    const y = 100               // 设置分数显示在屏幕上方，留出足够的空间

    
    ctx.fillText(score, x, y)
  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = '#ffffff'
    ctx.font = '20px Arial'

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      `得分: ${score}`,
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 200,
      120, 40
    )

    ctx.fillText(
      '分享好友',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 225
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 160,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 185
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 60,
      startY: screenHeight / 2 - 100 + 160,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 - 100 + 200
    }

    /**
     * 分享按钮区域
     * 方便简易判断按钮点击
     */
    this.shareBtnArea = {
      startX: screenWidth / 2 - 60,
      startY: screenHeight / 2 - 100 + 200,
      endX: screenWidth / 2 - 60 + 120,
      endY: screenHeight / 2 - 100 + 240
    }    
  }
}
