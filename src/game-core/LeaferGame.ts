import { PointerEvent } from 'leafer-ui';
import GameGraph, { UserGameConfig } from './GameGraph.ts';
import Storage from '../utils/Storage.ts';

export default abstract class LeaferGame<T> extends GameGraph<T> {
  private storage: Storage;

  /**
* 方向键事件
*/
  dirKeyboardEvent: (event: KeyboardEvent) => void = () => undefined;

  protected constructor(view: string, gameConfig: UserGameConfig<T>) {
    super(view, gameConfig);
    this.storage = new Storage();
  }

  bindDirKeyboardEvent() {
    this.dirKeyboardEvent = (event) => this.directionKeyboardAction(event);
    window.addEventListener('keydown', this.dirKeyboardEvent);
  }

  /**
* 移除方向键按键事件
*/
  removeDirKeyboardEvent() {
    window.removeEventListener('keydown', this.dirKeyboardEvent);
  }

  /**
* 绑定方向键按下事件
* @param event
*/
  async directionKeyboardAction(event: KeyboardEvent) {
    await this.onArrowKeyBefore();
    /* eslint-disable indent */
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        await this.onArrowKeyUp();
        break;
      case 'KeyS':
      case 'ArrowDown':
        await this.onArrowKeyDown();
        break;
      case 'KeyA':
      case 'ArrowLeft':
        await this.onArrowKeyLeft();
        break;
      case 'KeyD':
      case 'ArrowRight':
        await this.onArrowKeyRight();
        break;
      default: break;
    }
    /* eslint-enable */
    await this.onArrowKeyAfter();
  }

  /**
* 按下方向键之前
*/
  async onArrowKeyBefore() {
    // overrides method
  }

  /**
* 按下向上方向键
*/
  async onArrowKeyUp() {
    // overrides method
  }

  /**
* 按下向下方向键
*/
  async onArrowKeyDown() {
    // overrides method
  }

  /**
* 按下向左方向键
*/
  async onArrowKeyLeft() {
    // overrides method
  }

  /**
* 按下向右方向键
*/
  async onArrowKeyRight() {
    // overrides method
  }

  /**
* 按下方向键之后
*/
  async onArrowKeyAfter() {
    // overrides method
  }

  /**
* 绑定方向滑动事件
*/
  bindTapMoveEvent() {
    let isTapDown = false;
    let tapDownPos = { x: 0, y: 0 };
    // 鼠标、手指按下
    this.wrapper.on(PointerEvent.DOWN, (evt) => {
      isTapDown = true;
      tapDownPos = { x: evt.x, y: evt.y };
    });

    // 鼠标、手指移动
    this.wrapper.on(PointerEvent.MOVE, async (evt) => {
      if (!isTapDown) return;
      // 只有拖拽移动距离大于 60 时，才进行移动
      const isSlideX = Math.abs(evt.x - tapDownPos.x) > 60;
      const isSlideY = Math.abs(evt.y - tapDownPos.y) > 60;
      if (!isSlideY && !isSlideX) return;
      isTapDown = false;
      await this.onTapSlideBefore();
      if (isSlideX) {
        if (evt.x - tapDownPos.x > 0) {
          await this.onTapSlideToRight();
        } else {
          await this.onTapSlideToLeft();
        }
      } else if (evt.y - tapDownPos.y > 0) {
        await this.onTapSlideToDown();
      } else {
        await this.onTapSlideToUp();
      }
      await this.onTapSlideAfter();
    });

    // 鼠标、手指抬起
    this.wrapper.on(PointerEvent.UP, () => {
      isTapDown = false;
      tapDownPos = { x: 0, y: 0 };
    });
  }

  /**
* 手指、鼠标拖动之前
*/
  async onTapSlideBefore() {
    // overrides method
  }

  /**
* 手指、鼠标向右拖动
*/
  async onTapSlideToRight() {
    // overrides method
  }

  /**
* 手指、鼠标向左拖动
*/
  async onTapSlideToLeft() {
    // overrides method
  }

  /**
* 手指、鼠标向上拖动
*/
  async onTapSlideToUp() {
    // overrides method
  }

  /**
* 手指、鼠标向下拖动
*/
  async onTapSlideToDown() {
    // overrides method
  }

  /**
* 手指、鼠标拖动之后
*/
  async onTapSlideAfter() {
    // overrides method
  }

  /**
* 开始游戏
*/
  abstract start(): void;

  /**
* 停止游戏
*/
  abstract stop(): void;

  /**
* 暂停游戏
*/
  abstract paused(): void;

  /**
* 恢复游戏（恢复已暂定的游戏）
*/
  abstract resume(): void;

  /**
* 保存游戏状态
*/
  async setGameState(key: string, val: any) {
    await this.storage.set(key, val);
  }

  async getGameState(key: string) {
    const res = await this.storage.get(key);
    return res;
  }

  async removeGameState(key: string) {
    await this.storage.remove(key);
  }
}
