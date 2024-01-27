import Animation from '../base/animation'
import DataBus from '../databus'

const BULLET_IMG_SRC = 'images/bossbullet1.png'
const BULLET_WIDTH = 16
const BULLET_HEIGHT = 30

const __ = {
  speed: Symbol('speed')
}

const databus = new DataBus()

export default class BossBullet extends Animation {
  constructor() {
    super(BULLET_IMG_SRC, BULLET_WIDTH, BULLET_HEIGHT)
  }

  init(x, y, speed) {
    this.x = x
    this.y = y

    this[__.speed] = speed
    this.visible = true
    this.horizontalMove = 1.5
  }

  // 每一帧更新子弹位置
  update() {
    // 增加一个变量来控制左右移动
    if (!this.horizontalMove) {
      this.horizontalMove = 0;
    }

    // 改变子弹的x坐标，使其左右移动
    // 您可以调整参数来改变移动的幅度和速度
    this.x += Math.sin(this.horizontalMove) * 20;
    this.horizontalMove += 0.1;

    // 子弹继续下降
    this.y += this[__.speed]

    // 超出屏幕外回收自身
    if (this.y > window.innerHeight + this.height)
      databus.removeBossBullets(this)
  }
}