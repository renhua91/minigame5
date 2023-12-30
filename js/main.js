import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import Treasure from './npc/treasure'

const ctx = canvas.getContext('2d')
const databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    console.log("zzzzzzzz")
    this.aniId = 0

    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()
    this.treasures = [new Treasure()]

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId)

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  shareToWeChat() {
    console.log("用户点击分享")
    wx.shareAppMessage({
      title: '是兄弟就来大战肥高',
    })
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      const enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(3)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    const that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        const enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score += 1

          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      const enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    const x = e.touches[0].clientX
    const y = e.touches[0].clientY

    const area = this.gameinfo.btnArea

    if (x >= area.startX &&
      x <= area.endX &&
      y >= area.startY &&
      y <= area.endY) {
      this.restart()
    }

    const shareArea = this.gameinfo.shareBtnArea

    if (x >= shareArea.startX &&
      x <= shareArea.endX &&
      y >= shareArea.startY &&
      y <= shareArea.endY) {
      this.shareToWeChat()
    }

  }

  /**
   * canvas重绘函数---
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })
    // 渲染宝箱
    this.treasures.forEach(treasure => {
      console.log("zzzzzzzz1")
      treasure.drawToCanvas(ctx)
    })



    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver) return

    this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()
    this.createTreasure()
    this.collisionDetection()

    // 更新宝箱的状态
    this.treasures.forEach(treasure => {
      treasure.update() // 确保宝箱的每个实例都被更新
    })

    if (databus.frame % 20 === 0) {
      this.player.shoot()
      this.music.playShoot()
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  // 在适当的位置生成宝箱
  createTreasure() {
    if (this.frame % 300 === 0) { // 举例，每3000帧生成一个宝箱
      let treasure = new Treasure()
      // 设置宝箱的初始位置和其他属性...
      this.treasures.push(treasure)
    }
  }
  // 检查玩家是否与宝箱碰撞
  checkCollisionWithTreasure() {
    for (let i = 0; i < this.treasures.length; i++) {
      let treasure = this.treasures[i]
      if (this.player.collidesWith(treasure)) {
        this.player.addBulletBuff() // 增加子弹数
        // 移除宝箱或做其他处理...
      }
    }
  }

}