import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance) return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame = 0
    this.score = 0
    this.bullets = []
    this.bossBullets = []
    this.enemys = []
    this.boss = []
    this.treasures = []
    this.animations = []
    this.gameOver = false
    this.resetPool()
  }

  enterNext() {
    this.frame = 0
    this.bullets = []
    this.bossBullets = []
    this.enemys = []
    this.boss = []
    this.treasures = []
    this.animations = []
    this.gameOver = false
    this.resetPool()
  }

  resetPool() {
    // 这里添加重置对象池的逻辑
    this.pool.clear(); // 假设 Pool 类有 clear 方法
  }

  /**
   * 回收boss，进入对象池
   * 此后不进入帧循环
   */
  removeBoss(boss) {
    const temp = this.boss.shift()

    temp.visible = false

    this.pool.recover('boss', boss)
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    const temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  /**
   * 回收boss子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBossBullets(bossBullet) {
    const temp = this.bossBullets.shift()

    temp.visible = false

    this.pool.recover('bossBullet', bossBullet)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    const temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeTreasure(treasure) {
    const temp = this.treasures.shift()

    temp.visible = false

    this.pool.recover('treasure', treasure)
  }
}
