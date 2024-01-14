import Sprite from '../base/sprite'
import DataBus from '../databus'
import Animation from '../base/animation' 
import Treasure from './treasure.js';
const TREASURE2_IMG_SRC = 'images/bubble2.jpg'; // 宝藏2的图片路径
const TREASURE2_WIDTH = 60; // 宝藏2的宽度
const TREASURE2_HEIGHT = 45; // 宝藏2的高度
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}
let databus = new DataBus()

export default class Treasure2 extends Treasure {
  constructor() {
    super(TREASURE2_IMG_SRC, TREASURE2_WIDTH, TREASURE2_HEIGHT);
    // 如果有其他不同的属性或方法，也可以在这里添加
  }

  // 重写 init 方法，因为源代码里TREASURE类里面用的常亮作为参数，我懒得改了。by Colin

  init() {
    this.x = rnd(0, screenWidth - TREASURE2_WIDTH)
    this.y = -this.height

    this.speed = 9

    this.visible = true
  }

  // 宝箱的逻辑更新
  update() {
    if (!this.visible)
      return

    this.y += this.speed

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