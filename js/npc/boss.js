// boss.js
import Animation from '../base/animation'
import DataBus from '../databus'
import BossBullet from './bossBullet'

const BOSS_IMG_SRC = 'images/boss1.png' // 假设 Boss 的图片路径
const BOSS_WIDTH = 300
const BOSS_HEIGHT = 200

const screenWidth = window.innerWidth

const databus = new DataBus()

export default class Boss extends Animation {
  constructor() {
    super(BOSS_IMG_SRC, BOSS_WIDTH, BOSS_HEIGHT)
    this.init()
    this.initExplosionAnimation()
  }

  setBossImage(level) {
    let bossImageSrc;
    switch (level) {
      case 2:
        bossImageSrc = 'images/boss2.png'; // 第二关的Boss图片
        break;
      case 3:
        bossImageSrc = 'images/boss3.png'; // 第三关的Boss图片
        break;
      default:
        bossImageSrc = 'images/boss1.png'; // 默认的Boss图片
    }
  
    this.img.src = bossImageSrc;
  }

  init() {
    this.x = screenWidth / 2 - this.width / 2
    this.y = -this.height
    this.hp = 100
    this.originalhp = 100
    this.visible = true
    this.bossBullets = []
    this.bulletCount = 2
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

  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    for (let i = 0; i < this.bulletCount; i++) {
      const bossBullet = databus.pool.getItemByClass('bossBullet', BossBullet)

      // 调整每枚子弹的初始位置
      let bulletX = this.x + this.width / 2 - bossBullet.width / 2;

      // 根据子弹的索引调整子弹的水平位置
      // 这里的10是子弹之间的水平间距，可以根据需要调整
      bulletX += (i - 1) * 10;
      bossBullet.init(
        bulletX,
        this.y + BOSS_HEIGHT,
        3
      )
      databus.bossBullets.push(bossBullet)
    }
  }

  drawToCanvas(ctx) {
    super.drawToCanvas(ctx);

    if (!this.visible) return;

    // 绘制血量条
    const barWidth = this.width; // 血量条的宽度，与敌人宽度相同
    const barHeight = 5; // 血量条的高度
    const barX = this.x;
    const barY = this.y - barHeight - 5; // 血量条在敌人上方一定距离

    // 背景条
    ctx.fillStyle = 'gray';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // 血量条
    const healthRatio = this.hp / this.originalhp; // 当前血量与原始血量的比例
    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, barWidth * healthRatio, barHeight);
  }
}
