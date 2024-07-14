/*
 * @Author: zi.yang
 * @Date: 2024-07-06 11:34:17
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-07-06 14:42:00
 * @Description: 贪吃蛇
 * @FilePath: /leafer-games/src/views/snake/index.ts
 */
import { message } from 'ant-design-vue';
import { Rect as LeaferRect, Star } from 'leafer-ui';

import { UserGameConfig } from '@/game-core/GameGraph';
import LeaferGame from '@/game-core/LeaferGame';
import { randomInt } from '@/utils';

type MarblesGameConfig = {
  updateScore: (val: number) => void
};

const size = 10;

export default class SnakeGame extends LeaferGame<MarblesGameConfig> {
  private snake: LeaferRect[] = [];

  private timer: number = 0;

  private star: Star | null = null;

  private score: number = 0;

  private to = [size, 0];

  constructor(view: string, gameConfig: UserGameConfig<MarblesGameConfig>) {
    super(view, gameConfig);
    this.initGameMap();
  }

  addSnakeBody() {
    // @ts-ignore
    const last = this.snake.at(-1);
    if (!last) return;
    const body = new LeaferRect({
      width: size,
      height: size,
      x: last.x! - size,
      y: last.y!,
      fill: 'black',
    });
    this.wrapper!.add(body);
    this.snake.push(body);
  }

  drawSnake() {
    const head = new LeaferRect({
      width: size,
      height: size,
      x: 100,
      y: 100,
      fill: 'red',
      zIndex: 10,
    });
    this.wrapper!.add(head);
    this.snake.push(head);
    this.addSnakeBody();
    this.addSnakeBody();
    this.addSnakeBody();
  }

  /**
   * 按下向上方向键
   */
  onArrowKeyUp() {
    if (this.to[1]) return;
    this.to = [0, -size];
  }

  /**
   * 按下向下方向键
   */
  onArrowKeyDown() {
    if (this.to[1]) return;
    this.to = [0, size];
  }

  /**
   * 按下向左方向键
   */
  onArrowKeyLeft() {
    if (this.to[0]) return;
    this.to = [-size, 0];
  }

  /**
   * 按下向右方向键
   */
  onArrowKeyRight() {
    if (this.to[0]) return;
    this.to = [size, 0];
  }

  /**
   * 按下方向键之后
   */
  onArrowKeyAfter() {
    this.moveSnake();
  }

  checkBoundaryCollision(x: number, y: number) {
    const checkRight = x + size > this.wrapper.width!;
    const checkLeft = x < 0;
    const checkTop = y < 0;
    const bottom = y + size > this.wrapper.height!;
    return checkRight || checkLeft || checkTop || bottom;
  }

  eatFoodHandler() {
    const { x, y } = this.snake[0];
    if (x === this.star!.x && y === this.star!.y) {
      this.addSnakeBody();
      this.updateScore();
      this.refreshStar();
    }
  }

  checkBodyPosition() {
    const [head, ...body] = this.snake;
    return body.some((item) => item.x === head.x && item.y === head.y);
  }

  moveSnake() {
    const [head, ...body] = this.snake;
    // 计算 head 移动位置
    const x = head.x! + this.to[0];
    const y = head.y! + this.to[1];

    // 边界碰撞检测
    if (this.checkBoundaryCollision(x, y) || this.checkBodyPosition()) {
      this.stop();
      return;
    }

    // 先移动 body
    for (let i = body.length - 1; i >= 0; i--) {
      const pre = this.snake[i];
      body[i].set({ x: pre.x, y: pre.y });
    }

    // 移动 head
    head.set({ x, y });
    this.eatFoodHandler();
  }

  createStar() {
    const star = new Star({
      width: size,
      height: size,
      fill: 'yellow',
      stroke: 'red',
    });
    this.star = star;
    this.wrapper?.add(star);
    this.refreshStar();
  }

  refreshStar() {
    const randomX = randomInt(0, this.wrapper.width!);
    const randomY = randomInt(0, this.wrapper.height!);
    const x = Math.floor(randomX / size) * size;
    const y = Math.floor(randomY / size) * size;
    // 检查是否刷新在蛇的身体里
    if (this.snake.some((item) => item.x === x && item.y === y)) {
      this.refreshStar();
    } else {
      this.star!.set({ x, y });
    }
  }

  updateScore() {
    this.score += 1;
    this.config.updateScore(this.score);
  }

  start() {
    clearInterval(this.timer);
    this.createStar();
    this.bindDirKeyboardEvent();
    this.timer = window.setInterval(() => {
      this.moveSnake();
    }, 200);
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = 0;
    message.warn(`游戏结束, 最终得分：${this.score}`);
    this.removeDirKeyboardEvent();
  }

  paused() {
  }

  resume() {
  }

  initGameMap() {
    this.drawSnake();
  }

  restart() {
    this.score = 0;
    this.config.updateScore(0);
    this.snake = [];
    this.to = [size, 0];
    clearInterval(this.timer);
    this.removeDirKeyboardEvent();
    super.restart();
    this.start();
  }
}
