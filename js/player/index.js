import Sprite from '../base/sprite'
import Bullet from './bullet'
import DataBus from '../databus'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'
const PLAYER_WIDTH = 90
const PLAYER_HEIGHT = 80

const databus = new DataBus()

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight - this.height - 30

    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false
    this.shootFrequency = 30

    this.bullets = []
    this.bulletCount = 1

    this.bulletSpeedMultiplier = 1; // 新属性：子弹速度倍数

    // 初始化事件监听
    this.initEvent()
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(x >= this.x - deviation &&
      y >= this.y - deviation &&
      x <= this.x + this.width + deviation &&
      y <= this.y + this.height + deviation)
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2
    let disY = y - this.height / 2

    if (disX < 0) disX = 0

    else if (disX > screenWidth - this.width) disX = screenWidth - this.width

    if (disY <= 0) disY = 0

    else if (disY > screenHeight - this.height) disY = screenHeight - this.height

    this.x = disX
    this.y = disY
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      //
      if (this.checkIsFingerOnAir(x, y)) {
        this.touched = true

        this.setAirPosAcrossFingerPosZ(x, y)
      }
    }))

    canvas.addEventListener('touchmove', ((e) => {
      e.preventDefault()

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      if (this.touched) this.setAirPosAcrossFingerPosZ(x, y)
    }))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()

      this.touched = false
    }))
  }

  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    for (let i = 0; i < this.bulletCount; i++) {
      const bullet = databus.pool.getItemByClass('bullet', Bullet)

      // 调整每枚子弹的初始位置
      let bulletX = this.x + this.width / 2 - bullet.width / 2;

      // 根据子弹的索引调整子弹的水平位置
      // 这里的10是子弹之间的水平间距，可以根据需要调整
      bulletX += (i - 1) * 10;
      // 使用 bulletSpeedMultiplier 计算子弹速度
      bullet.init(bulletX, this.y - 10, 10 * this.bulletSpeedMultiplier)
      databus.bullets.push(bullet)
    }
  }
  // 增加一个方法来处理buff
  addBulletBuff() {
    if (this.bulletCount < 4) {
      this.bulletCount += 1;
    }
  }
  increaseBulletSpeed() {
    if (this.shootFrequency > 10) {
      this.shootFrequency -= 5;
    }
  }

  getShootFrequency() {
   return this.shootFrequency;
  }

}