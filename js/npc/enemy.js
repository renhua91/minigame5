import Animation from '../base/animation'
import DataBus from '../databus'

const ENEMY_IMG_PREFIX = 'images/enemy'; // 贴图路径前缀
const ENEMY_WIDTH = 70
const ENEMY_HEIGHT = 65

const __ = {
  speed: Symbol('speed'),
  hp: Symbol('hp')
}

const databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Animation {
  constructor(type) {
    super(`${ENEMY_IMG_PREFIX}${type}.png`, ENEMY_WIDTH, ENEMY_HEIGHT)

    this.initExplosionAnimation()
    // 根据类型设置不同的血量
    this[__.hp] = this.setHPByType(type)
  }

  setHPByType(type) {
    // 根据类型设置不同的血量
    switch (type) {
      case 1:
        return 1;
      case 2:
        return 4;
      case 3:
        return 6;
      case 4:
        return 10;
      default:
        return 1;
    }
  }

  init(speed, type) {
    this.x = rnd(0, window.innerWidth - ENEMY_WIDTH)
    this.y = -this.height

    this[__.speed] = speed
    this[__.hp] = this.setHPByType(type)  // 设置敌人的血量
    this.img.src = `${ENEMY_IMG_PREFIX}${type}.png`; // 设置敌人的图像

// 设置贴图路径
this.img.src = `${ENEMY_IMG_PREFIX}${type}.png`;

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    const frames = []

    const EXPLO_IMG_PREFIX = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(`${EXPLO_IMG_PREFIX + (i + 1)}.png`)
    }

    this.initFrames(frames)
  }

  // 减少敌人的血量
 reduceHP() {
  this[__.hp]--;
}

// 获取当前敌人的血量
getHP() {
  return this[__.hp];
}
  
  // 每一帧更新子弹位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if (this.y > window.innerHeight + this.height) databus.removeEnemey(this)
  }
}
