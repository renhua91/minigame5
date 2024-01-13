import Treasure from './treasure.js';
const TREASURE2_IMG_SRC = 'images/bubble2.jpg'; // 宝藏2的图片路径
const TREASURE2_WIDTH = 60; // 宝藏2的宽度
const TREASURE2_HEIGHT = 45; // 宝藏2的高度


export default class Treasure2 extends Treasure {
  constructor() {
    super(TREASURE2_IMG_SRC, TREASURE2_WIDTH, TREASURE2_HEIGHT);
    // 如果有其他不同的属性或方法，也可以在这里添加
  }

  // 如果有其他不同的逻辑，可以在这里重写方法
}