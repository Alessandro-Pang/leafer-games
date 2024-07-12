import { Rect as LeaferRect, Ellipse as LeaferEllipse, Star } from 'leafer-ui';
import { message } from 'ant-design-vue';
import LeaferGame from '../../game-core/LeaferGame.ts';
import { UserGameConfig } from '../../game-core/GameGraph.ts';

type MarblesGameConfig = {
  step: number,
  updateScore: (val: number) => void
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export default class MarblesGame extends LeaferGame<MarblesGameConfig> {
  ball: LeaferEllipse | null = null;

  board: LeaferRect | null = null;

  private animateId: number = 0;

  private stars: Star[] = [];

  private score = 0;

  private keydown = false;

  private boardMove = 0;

  private isStopped = true;

  constructor(view: string, gameConfig: UserGameConfig<MarblesGameConfig>) {
    super(view, gameConfig);
    this.initGameMap();
  }

  drawBoard() {
    if (!this.wrapper) return;
    const width = 60;
    const rect = new LeaferRect({
      height: 10,
      width,
      x: this.wrapper.width! / 2 - width / 2,
      y: this.wrapper.height! - 10,
      fill: 'blue',
    });
    this.board = rect;
    this.wrapper.add(rect);
  }

  drawBall() {
    const { step } = this.config;
    // 让小球的初始轨迹随机一些
    const dx = Math.random() > 0.5 ? -step : step;
    const ball = new LeaferEllipse({
      width: 20,
      height: 20,
      fill: 'red',
      y: this.wrapper.height! - 30,
      x: this.wrapper.width! / 2 - 10,
      data: { dx, dy: -step },
    });
    this.wrapper.add(ball);
    this.ball = ball;
  }

  moveBall() {
    if (!this.ball || !this.wrapper) return;
    const x = this.ball.x!;
    const y = this.ball.y!;
    const ballSize = this.ball.width!;
    // 底部检测
    if (y > this.wrapper.height! - this.board!.height! - ballSize) {
      if (x + ballSize > this.board!.x! && x < this.board!.x! + this.board!.width!) {
        this.ball.data.dy = -this.config.step;
      } else if (y > this.wrapper.height! - ballSize) {
        this.ball.y = this.wrapper.height! - ballSize;
        this.stop();
        return;
      }
    }
    if (x < this.ball.width!) {
      this.ball.data.dx = this.config.step;
    }
    if (x > this.wrapper.width! - this.ball.width!) {
      this.ball.data.dx = -this.config.step;
    }
    if (y < this.ball.height!) {
      this.ball.data.dy = this.config.step;
    }

    // 暴力寻找
    const starIndex = this.stars.findIndex((star) => {
      const x1 = star.x! < x && star.x! + star.width! > x;
      const x2 = star.x! < x + this.ball!.width! && star.x! + star.width! > x + this.ball!.width!;
      const y1 = star.y! < y && star.y! + star.height! > y;
      const y2 = star.y! < y + this.ball!.height! && star.y! + star.height! > y + this.ball!.height!;
      return (x1 && y1) || (x2 && y2) || (x1 && y2) || (x2 && y1);
    });
    if (starIndex > -1) {
      this.ball.data.dx *= -1;
      this.ball.data.dy *= -1;
      this.stars[starIndex].remove();
      this.stars.splice(starIndex, 1);
      this.updateScore();
      this.createStar();
    }
    this.ball.set({ x: x + this.ball.data.dx, y: y + this.ball.data.dy });
  }

  createStar() {
    const star = new Star({
      width: 20,
      height: 20,
      x: randomInt(50, this.wrapper.width! - 50),
      y: randomInt(50, this.wrapper.height! - 100),
      fill: 'yellow',
      stroke: 'red',
      strokeWidth: 1,
    });
    this.wrapper.add(star);
    this.stars.push(star);
  }

  onArrowKeyBefore() {
    this.keydown = true;
  }

  onArrowKeyLeft() {
    this.keydown = true;
    this.boardMove = -4;
  }

  onArrowKeyRight() {
    this.keydown = true;
    this.boardMove = 4;
  }

  updateScore() {
    this.score++;
    this.config.updateScore(this.score);
  }

  initStarList() {
    for (let i = 0; i < 10; i++) {
      this.createStar();
    }
  }

  moveBoard() {
    if (!this.keydown || this.board === null) return;
    if (this.boardMove < 0) {
      this.board.x! += this.board.x! > 0 ? this.boardMove : 0;
    } else {
      const width = this.wrapper.width!;
      // 右边界检测
      const isRight = this.board.x! + this.board.width! > width;
      this.board.x! += isRight ? 0 : 4;
    }
  }

  moveAnimate() {
    this.animateId = window.requestAnimationFrame(() => {
      if (this.isStopped) return;
      this.moveBall();
      this.moveBoard();
      this.moveAnimate();
    });
  }

  start() {
    this.isStopped = false;
    this.moveAnimate();
    this.initStarList();
    this.bindDirKeyboardEvent();
    window.addEventListener('keyup', () => (this.keydown = false));
  }

  stop() {
    this.isStopped = true;
    this.removeDirKeyboardEvent();
    window.cancelAnimationFrame(this.animateId!);
    message.warn(`游戏结束, 最终得分：${this.score}`);
  }

  paused() {

  }

  resume() {
  }

  initGameMap() {
    this.drawBoard();
    this.drawBall();
  }

  restart() {
    this.score = 0;
    this.stars = [];
    this.config.updateScore(0);
    window.cancelAnimationFrame(this.animateId!);
    super.restart();
    this.start();
  }
}
