// 假设 Enemy 类和 Sprite 类的路径如下，根据实际情况调整
import Sprite from '../base/sprite'
import DataBus from '../databus'
import Animation from '../base/animation'

const TREASURE_IMG_SRC = 'images/bubble.jpg' // 宝箱图片路径
const TREASURE_WIDTH = 50
const TREASURE_HEIGHT = 40

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Treasure extends Animation {
  constructor() {
    super(TREASURE_IMG_SRC, TREASURE_WIDTH, TREASURE_HEIGHT)

    this.init()
  }

  init() {
    this.x = rnd(0, screenWidth - TREASURE_WIDTH)
    this.y = -this.height

    this.speed = 2

    this.visible = true
  }

  // 宝箱的逻辑更新
  update() {
    console.log('Drawing treasure at', this.visible)

    if (!this.visible)
      return

    this.y += this.speed
    console.log('update treasure at', this.x, this.y)

    // 超出屏幕外回收自身
    if (this.y > screenHeight + this.height)
      databus.removeTreasure(this)
  }

  // 在 Treasure 类的 drawToCanvas 方法中
  drawToCanvas(ctx) {
    if (!this.visible) return

    // console.log('Drawing treasure at', this.x, this.y); // 调试信息

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}