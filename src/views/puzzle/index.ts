/*
 * @Author: zi.yang
 * @Date: 2024-07-06 11:34:17
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-07-06 14:41:52
 * @Description: 拼图
 * @FilePath: /leafer-games/src/views/puzzle/index.ts
 */
import { message } from 'ant-design-vue';
import { DragEvent, DropEvent, Rect as LeaferRect } from 'leafer-ui';

import type { IUI } from '@leafer-ui/interface';

import { UserGameConfig } from '@/game-core/GameGraph';
import LeaferGame from '@/game-core/LeaferGame';

type PuzzleGameOption = {
  count: number,
  url: string
};

export default class PuzzleGame extends LeaferGame<PuzzleGameOption> {
  private images: IUI[] = [];

  constructor(view: string, gameConfig: UserGameConfig<PuzzleGameOption>) {
    super(view, gameConfig);
    this.initGameMap();
  }

  initGameMap() {
    if (!this.config.url) return;
    for (let i = 0; i < this.config.count ** 2; i++) {
      const image = this.createImage(i, this.config.count);
      this.images.push(image);
      this.wrapper.add(image);
    }
    this.shuffleImages();
  }

  /**
   * 创建图片节点
   * @param idx
   * @param count
   */
  createImage(idx: number, count: number) {
    const width = this.wrapper.width! / count;
    const height = this.wrapper.height! / count;
    const x = (idx % count) * width;
    const y = Math.floor(idx / count) * height;
    return new LeaferRect({
      width,
      height,
      x,
      y,
      fill: {
        type: 'image',
        url: this.config.url,
        mode: 'clip',
        offset: { x: -x, y: -y },
      },
      data: { sortId: idx },
      stroke: '#fff',
      strokeWidth: 1,
      draggable: true,
      dragBounds: 'parent',
    });
  }

  /**
   * 打乱拼图排序
   */
  shuffleImages() {
    if (!this.wrapper) return;
    const imagePos = this.images.map((item) => ({ x: item.x, y: item.y }));
    this.wrapper.children.sort(() => (Math.random() > 0.5 ? -1 : 1));
    this.wrapper.children.forEach((node: IUI, idx) => {
      node.set(imagePos[idx]);
      node.data!.current = idx;
      this.bindMoveImageEvent(node as LeaferRect);
    });
    this.images = [...this.wrapper.children];
  }

  /**
   * 绑定图片移动事件
   * @param image
   */
  bindMoveImageEvent(image: LeaferRect) {
    let dragNode: LeaferRect | null = null;
    let [x, y] = [0, 0];
    image.off();
    image.on(DragEvent.START, (evt) => {
      const node = evt.target;
      if (!node) return;
      node.zIndex = 10000;
      x = node.x;
      y = node.y;
      dragNode = node;
      DragEvent.setData({ x, y, dragNode });
    });

    image.on(DragEvent.END, () => {
      if (!dragNode) return;
      dragNode.set({ zIndex: 1, x, y });
      dragNode = null;
    });

    image.on(DropEvent.DROP, (evt) => {
      const node = evt.target;
      const onDragNode = evt.data.dragNode;
      if (!node || !onDragNode) return;
      const size = onDragNode.width;
      // 校验是否斜角移动
      if (node.x !== onDragNode.x && node.y !== onDragNode.y) return;
      // 校验 x 移动格数
      if (node.x >= onDragNode.x + (size * 2) || node.x < onDragNode.x - size) {
        return;
      }
      // 校验 y 移动格数
      if (node.y >= onDragNode.y + (size * 2) || node.y < onDragNode.y - size) {
        return;
      }
      // 交换 current 值
      const targetIdx = node.data.current;
      const dragNodeIdx = onDragNode.data.current;
      onDragNode.data.current = targetIdx;
      node.data.current = dragNodeIdx;

      // 交换节点位置
      onDragNode.set({ x: node.x, y: node.y });
      node.set({ x: evt.data.x, y: evt.data.y });
      // 检查是否成功
      if (this.isCompleted()) {
        message.success('恭喜你，完成拼图');
        this.images.forEach((item) => {
          item.draggable = false;
          item.off();
        });
      }
    });
  }

  /**
   * 检查排序
   */
  isCompleted() {
    return this.images.every((item) => item.data!.current === item.data!.sortId);
  }

  start() {
  }

  stop() {
  }

  paused() {
  }

  resume() {
  }

  /**
   * 重置游戏
   * @param gameConfig
   */
  resetGame(gameConfig: UserGameConfig<PuzzleGameOption>) {
    this.images = [];
    this.config = gameConfig;
    this.restart();
  }
}
