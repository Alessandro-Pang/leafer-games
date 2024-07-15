/*
 * @Author: zi.yang
 * @Date: 2024-07-06 11:34:17
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-07-06 14:41:15
 * @Description: 2048
 * @FilePath: /leafer-games/src/views/2048/index.ts
 */
import { message } from 'ant-design-vue';
import { Box, Text, UI } from 'leafer-ui';
import type { IUI } from '@leafer-ui/interface';
import { UserGameConfig } from '@/game-core/GameGraph';
import LeaferGame from '@/game-core/LeaferGame';
import { randomInt } from '@/utils';

type MarblesGameConfig = {
  updateScore: (val: number) => void
};

const colorList = ['#eee4da', '#ede0c8', '#f2b179', '#f59563', '#f67c5f', '#f65e3b', '#edcf72', '#edcc61', '#edc850', '#edc53f', '#edc22e'];

const gameName = 'play2048Game';

export default class Play2048Game extends LeaferGame<MarblesGameConfig> {
  private score: number = 0;

  // 是否有移动的节点
  private hasMove = false;

  // 纪录已移动的节点存储栈
  private alreadyMoved: IUI[] = [];

  constructor(view: string, gameConfig: UserGameConfig<MarblesGameConfig>) {
    super(view, gameConfig);
    this.initGameMap();
  }

  get gridSize() {
    return this.wrapper.width! / 4;
  }

  get gridList(): IUI[] {
    return this.wrapper?.children.filter((node) => node.data!.type === 'grid') || [];
  }

  get blockList(): IUI[] {
    return this.wrapper?.children.filter((node) => node.data!.type === 'block') || [];
  }

  computed(value: number) {
    let val = value;
    let n = 0;
    while (val > 1) {
      val /= 2;
      n += 1;
    }
    return n;
  }

  addNumberBlock() {
    const randomGrid = this.gridList[randomInt(0, this.gridList.length - 1)];
    const size = this.gridSize - 10;
    const x = randomGrid.x! + 5;
    const y = randomGrid.y! + 5;
    // 当前位置是否已存在
    const isExists = this.blockList.some((block) => block.x === x && block.y === y);
    if (isExists) {
      this.addNumberBlock();
      return;
    }
    const value = 2;// Math.pow(2, randomInt(1, 10))
    // 创建数字方块
    const block = new Box({
      width: size,
      height: size,
      x,
      y,
      fill: '#eee4da',
      cornerRadius: 6,
      data: { type: 'block', value, cacheValue: value },
      zIndex: 2,
      children: [{
        tag: 'Text',
        text: `${value}`,
        width: size,
        height: size,
        fill: '#776e65',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: 40,
        fontWeight: 600,
        fontFamily: 'clear sans,helvetica neue,Arial,sans-serif',
      }],
    });
    this.wrapper?.add(block);
  }

  drawGrid() {
    if (!this.wrapper) return;
    for (let i = 0; i < 4 ** 2; i++) {
      const gridBox = new Box({
        width: this.gridSize,
        height: this.gridSize,
        x: (i % 4) * this.gridSize,
        y: Math.floor(i / 4) * this.gridSize,
        data: { type: 'grid' },
        zIndex: 1,
        children: [{
          tag: 'Rect',
          width: this.gridSize - 10,
          height: this.gridSize - 10,
          x: 5,
          y: 5,
          fill: '#EEE4DA59',
          cornerRadius: 6,
        }],
      });
      this.wrapper.add(gridBox);
    }
  }

  updateBlock(block: IUI) {
    const { value } = (block.data!);
    const newValue = value * 2;

    const idx = this.computed(newValue) - 1;
    block.set({
      fill: colorList[idx],
      data: {
        ...block.data, value: newValue, cacheValue: value, isAdd: true,
      },
    });
    const text = block.children![0] as Text;
    text.set({
      fill: newValue > 8 ? '#f9f6f2' : '#776e65',
      text: `${newValue}`,
    });
    this.updateScore(newValue);
  }

  /**
   * 数字方块移动逻辑
   * @param axis x轴 还是 y轴 移动
   * @param computed 计算当前方块移动位置
   */
  moveBlock(axis: 'x' | 'y', computed: (index: number, block: IUI) => number) {
    for (const block of this.blockList) { // eslint-disable-line
      let [i, position, lastIdx] = [0, 0, -1];
      block.data!.cacheValue = block.data!.value;
      block.data!.isAdd = false;

      for (;;) {
        position = computed(i, block);
        // 寻找同向是否方块
        const index = this.alreadyMoved.findIndex((node) => { // eslint-disable-line
          const another = axis === 'x' ? 'y' : 'x';
          return node[axis] === position && node[another] === block[another];
        });
        if (index === -1) break;
        lastIdx = index;
        i += 1;
      }

      if (block[axis]! !== position) {
        this.hasMove = true;
      }

      // 判断相邻方块是否是相同数字
      if (lastIdx > -1 && !this.alreadyMoved[lastIdx].data!.isAdd) {
        const preBlock = this.alreadyMoved[lastIdx];
        const value = preBlock.data!.cacheValue;

        if (value === block.data!.value) {
          block.remove();
          this.hasMove = true;
          this.updateBlock(preBlock);
          continue;
        }
      }
      block[axis] = position;
      this.alreadyMoved.push(block);
    }
  }

  async onTapSlideBefore() {
    this.hasMove = false;
  }

  async onTapSlideToRight() {
    this.wrapper!.children.sort((a, b) => b.x! - a.x!);
    this.moveBlock('x', (i, block) => this.wrapper!.width! - ((i + 1) * block.width! + (i + 1) * 5 + i * 5));
  }

  async onTapSlideToLeft() {
    this.wrapper!.children.sort((a, b) => a.x! - b.x!);
    this.moveBlock('x', (i, block) => i * block.width! + i * 5 + (i + 1) * 5);
  }

  async onTapSlideToUp() {
    this.wrapper!.children.sort((a, b) => a.y! - b.y!);
    this.moveBlock('y', (i, block) => i * block.height! + i * 5 + (i + 1) * 5);
  }

  async onTapSlideToDown() {
    this.wrapper!.children.sort((a, b) => b.y! - a.y!);
    this.moveBlock('y', (i, block) => this.wrapper!.height! - ((i + 1) * block.height! + (i + 1) * 5 + i * 5));
  }

  async onTapSlideAfter() {
    if (this.hasMove) {
      await this.setGameState(gameName, {
        score: this.score,
        node: this.wrapper.toJSON(),
      });
      this.addNumberBlock();
    }
    this.alreadyMoved = [];
    if (this.checkGameOver()) {
      this.stop();
    }
  }

  async onArrowKeyBefore() {
    await this.onTapSlideBefore();
  }

  async onArrowKeyUp() {
    await this.onTapSlideToUp();
  }

  async onArrowKeyDown() {
    await this.onTapSlideToDown();
  }

  async onArrowKeyLeft() {
    await this.onTapSlideToLeft();
  }

  async onArrowKeyRight() {
    await this.onTapSlideToRight();
  }

  async onArrowKeyAfter() {
    await this.onTapSlideAfter();
  }

  checkGameOver() {
    const len = this.blockList.length;
    if (len !== 16) return false;
    // 从上到下，从左到右排序
    // 这样我们就可以通过下标 i % 4 == (0, 3) 获取每行数据， Math.floor(i / 4) 获取每列数据
    // 变相形成二维数组，同时我们只需要从左向右，从上到下检查是否有相同的即可。
    this.wrapper?.children.sort((a, b) => (a.y! - b.y! === 0 ? a.x! - b.x! : a.y! - b.y!));
    for (let i = 0; i < len; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const currentVal = this.blockList[i]?.data!.value;
      const rightVal = col !== 3 ? this.blockList[i + 1]?.data!.value : -1;
      const bottomVal = row !== 4 ? this.blockList[i + 4]?.data!.value : -1;
      if (currentVal === rightVal || currentVal === bottomVal) return false;
    }
    return true;
  }

  updateScore(score: number) {
    this.score += score;
    this.config.updateScore(this.score);
  }

  start() {
    this.bindTapMoveEvent();
    this.bindDirKeyboardEvent();
  }

  stop() {
    this.wrapper!.off();
    this.removeDirKeyboardEvent();
    this.removeGameState(gameName);
    message.warn(`游戏结束, 最终得分：${this.score}`);
  }

  paused() {
  }

  resume() {
  }

  async initGameMap() {
    const state = await this.getGameState(gameName);
    this.bbox.set({
      fill: '#bbada0',
      cornerRadius: 8,
      stroke: '#bbada0',
    });
    if (state) {
      this.score = state.score;
      this.config.updateScore(this.score);
      this.wrapper.remove();
      this.wrapper = UI.one(state.node) as Box;
      this.bbox.add(this.wrapper);
    } else {
      this.drawGrid();
      this.addNumberBlock();
      this.addNumberBlock();
    }
  }

  restart() {
    this.score = 0;
    this.config.updateScore(0);
    this.removeGameState(gameName);
    super.restart();
    this.start();
  }
}
