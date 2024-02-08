const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo {
  constructor() {
    this.scoreFontSize = 40; // 初始字体大小
    this.scoreFontColor = '#FFA500'; // 初始字体颜色
    this.isAnimating = false; // 是否正在播放动画
    this.animationDuration = 500; // 动画持续时间，单位毫秒
    this.lastAnimationTime = 0; // 上次动画开始的时间
  }

  renderGameScore(ctx, score) {
    ctx.fillStyle = this.scoreFontColor;
    ctx.font = `${this.scoreFontSize}px Fredoka One`;

    const x = 20 // 设置分数显示在屏幕中间
    const y = 800 // 设置分数显示在屏幕上方，留出足够的空间

    // 渲染“本局得分”文字
    ctx.font = 'bold 30px Fredoka One'; // 设置较小的字体大小
    ctx.fillText('击落', x, y - 30); // 将文字放在得分上方

    // 渲染得分
    ctx.fillText(score, x, y)

    // 更新动画状态
    // this.updateAnimation();
  }

  // 在 gameinfo.js 中添加
  renderStartBg(ctx, startButtonImg) {
    const buttonWidth = 300;
    const buttonHeight = 200;
    const buttonX = (screenWidth - buttonWidth) / 2;
    const buttonY = (screenHeight - buttonHeight) / 2;

    // 加载开始按钮图像
    // this.startBgImg = new Image();
    // this.startBgImg.src = 'images/startBg.jpg';
    ctx.drawImage(startButtonImg, buttonX, buttonY, buttonWidth, buttonHeight);
  }

  // 在 gameinfo.js 中添加
  renderStartButton(ctx, startButtonImg) {
    console.log("进入renderStartButton")
    const buttonWidth = 200;
    const buttonHeight = 100;
    const buttonX = (screenWidth - buttonWidth) / 2;
    const buttonY = (screenHeight - buttonHeight) / 2 + 200;

    ctx.drawImage(startButtonImg, buttonX, buttonY, buttonWidth, buttonHeight);

    // 保存按钮区域，用于后续的点击事件检测
    this.startButtonArea = {
      startX: buttonX,
      startY: buttonY,
      endX: buttonX + buttonWidth,
      endY: buttonY + buttonHeight
    };
  }

  getRankResult(score) {
    if (score <= 10) {
      return "兄dei，你太菜了！！！"
    }

    if (score > 10 && score < 20) {
      return "你战胜了全国70%的玩家"
    }

    if (score > 130) {
      return "你战胜了全国99%的玩家"
    }

    return `你战胜了全国: ${(score*100/130).toFixed(0)}%的玩家`
  }

  renderGameOver(ctx, score, victory) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = '#ffffff'
    ctx.font = '20px Arial'

    ctx.fillText(
      victory ? "游戏胜利" : "游戏结束",
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      this.getRankResult(score),
      screenWidth / 2 - 100,
      screenHeight / 2 - 100 + 80
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
      screenHeight / 2 - 100 + 160,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 185
    )

    if (!victory) {
      ctx.drawImage(
        atlas,
        120, 6, 39, 24,
        screenWidth / 2 - 60,
        screenHeight / 2 - 100 + 200,
        120, 40
      )

      ctx.fillText(
        '分享复活',
        screenWidth / 2 - 40,
        screenHeight / 2 - 100 + 225
      )
    }

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

    if (!victory) {
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
}