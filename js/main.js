import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import Treasure from './npc/treasure'
import Boss from './npc/boss'
import Treasure2 from './npc/treasure2'

const ctx = canvas.getContext('2d')
const databus = new DataBus()

/**
 * 游戏主函数-大战肥高
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    // 初始化 startTime
    this.startTime = Date.now();
    this.bossGenerated = false;
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
    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false
    this.bossGenerated = false;
    this.startTime = Date.now();

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
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.startTime) / 1000; // 游戏经过的时间（秒）
    const bossTime = 30;

    if (!this.bossGenerated && elapsedTime > bossTime) {
      const boss = databus.pool.getItemByClass('boss', Boss)
      boss.init();
      databus.boss.push(boss);
      this.bossGenerated = true;
    }

    if (this.bossGenerated) {
      // 如果boss出现了则不出现其他敌机
      return
    }

    if (databus.frame % 30 === 0) {
      let enemyType = 1; // 默认为血量1
      // console.log("出现type1",currentTime);
      // 根据经过的时间设置敌人的血量类型
      if (elapsedTime > 10) {
        if (Math.random() < 0.5) {
          enemyType = 2; // 20%的概率生成血量2的敌人
        }
      }

      if (elapsedTime > 20) {
        if (Math.random() < 0.3) {
          enemyType = 3; // 20%的概率生成血量3的敌人
        }
      }

      if (elapsedTime > 30) {
        if (Math.random() < 0.3) {
          enemyType = 4; // 20%的概率生成血量4的敌人
        }
      }
      const enemy = databus.pool.getItemByClass('enemy', Enemy, enemyType)
      enemy.init(6, enemyType);
      databus.enemys.push(enemy);
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    const that = this

    //子弹和enemy的碰撞逻辑
    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        const enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          // 减少敌人血量
          enemy.reduceHP();

          // 如果敌人血量为0，执行相应的操作
          if (enemy.getHP() <= 0) {
            enemy.playAnimation();
            that.music.playExplosion();
            databus.score += 1;
          }

          // 隐藏子弹
          bullet.visible = false;
          break
        }
      }
    })

    //子弹和boss的碰撞逻辑
    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.boss.length; i < il; i++) {
        const boss = databus.boss[i]

        if (!boss.isPlaying && boss.isCollideWith(bullet)) {
          // 减少敌人血量
          boss.reduceHP();

          // 如果敌人血量为0，执行相应的操作
          if (boss.getHP() <= 0) {
            boss.playAnimation();
            that.music.playExplosion();
            databus.score += 1;
            databus.gameOver = true
          }

          // 隐藏子弹
          bullet.visible = false;
          break
        }
      }
    })

    //enemy和玩家的碰撞逻辑
    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      const enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true
        break
      }
    }

    //bossBullet和玩家的碰撞逻辑
    for (let i = 0, il = databus.bossBullets.length; i < il; i++) {
      const bossBullet = databus.bossBullets[i]

      if (this.player.isCollideWith(bossBullet)) {
        databus.gameOver = true
        break
      }
    }

    //宝箱和玩家的碰撞逻辑
    for (let i = 0, il = databus.treasures.length; i < il; i++) {
      const treasure = databus.treasures[i]

      if (this.player.isCollideWith(treasure)) {
        // 检查是否是宝藏2
        if (treasure instanceof Treasure2) {
          this.player.increaseBulletSpeed();
        } else {
          this.player.addBulletBuff(); // 宝藏1的现有逻辑
        }
        databus.removeTreasure(treasure)
        // 移除宝箱或做其他处理...
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
      return
    }

    const shareArea = this.gameinfo.shareBtnArea

    if (x >= shareArea.startX &&
      x <= shareArea.endX &&
      y >= shareArea.startY &&
      y <= shareArea.endY) {
      this.shareToWeChat()
      return
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
      .concat(databus.boss)
      .concat(databus.treasures)
      .concat(databus.bossBullets)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
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
      .concat(databus.boss)
      .concat(databus.treasures)
      .concat(databus.bossBullets)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()
    this.createTreasure()
    this.collisionDetection()

    // 玩家射击子弹
    if (databus.frame % 20 === 0) {
      this.player.shoot()
      this.music.playShoot()
    }

    // boss射击子弹
    if (databus.frame % 60 === 0 && this.bossGenerated) {
      databus.boss.forEach((item) => {
        item.shoot()
      })
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
    if (this.bossGenerated) {
      // 如果boss出现了则不出现宝箱
      return
    }

    if (databus.frame % 300 === 0) { // 假设每300帧生成一个宝藏
      let treasure;
      if (Math.random() < 0.5) {
        // 50% 的概率生成宝藏1
        treasure = new Treasure();
      } else {
        // 50% 的概率生成宝藏2
        treasure = new Treasure2();
        console.log("宝箱2", treasure.TREASURE2_HEIGHT)
      }
      treasure.init();
      databus.treasures.push(treasure);
    }
  }

}