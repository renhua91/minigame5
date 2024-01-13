// boss.js
import Animation from '../base/animation'
import DataBus from '../databus'

const BOSS_IMG_SRC = 'images/boss.png' // 假设 Boss 的图片路径
const BOSS_WIDTH = 120
const BOSS_HEIGHT = 100

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const databus = new DataBus()

export default class Boss extends Animation {
  constructor() {
    super(BOSS_IMG_SRC, BOSS_WIDTH, BOSS_HEIGHT)
    this.init()
  }

  init() {
    this.x = screenWidth / 2 - this.width / 2
    this.y = -this.height
    this.hp = 100
    this.visible = true
  }

  // Boss 的逻辑更新
  update() {
    if (!this.visible) return

    if (this.y < 90) {
      this.y += 2
    }
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
    this.hp--;
  }

  // 获取当前敌人的血量
  getHP() {
    return this.hp;
  }
}
