import {Rect as LeaferRect, Star} from "leafer-ui";
import LeaferGame, {GameOptions} from "../../utils/LeaferGame.ts";
import {message} from "ant-design-vue";
import {randomInt} from "../../utils";

type MarblesGameConfig = {
	updateScore: (val: number) => void
} & Partial<GameOptions>

const size = 10

export default class SnakeGame extends LeaferGame {
	private snake: LeaferRect[] = [];
	private timer: number | null = null;
	private star: Star | null = null;
	private score: number = 0;
	private to = [size, 0]

	constructor(view: string, gameConfig: MarblesGameConfig) {
		super(view, gameConfig);
		this.runGame()
	}

	addSnakeBody() {
		// @ts-ignore
		const last = this.snake.at(-1);
		if (!last) return
		const body = new LeaferRect({
			width: size,
			height: size,
			x: last.x! - size,
			y: last.y!,
			fill: 'black',
		})
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
			zIndex: 10
		})
		this.wrapper!.add(head);
		this.snake.push(head);
		this.addSnakeBody()
		this.addSnakeBody()
		this.addSnakeBody()
	}

	bindMovePositionEvent() {
		window.addEventListener('keydown', (evt) => {
			switch (evt.code) {
				case 'KeyW':
				case 'ArrowUp':
					if (this.to[1]) break
					this.to = [0, -size]
					break
				case 'KeyS':
				case 'ArrowDown':
					if (this.to[1]) break
					this.to = [0, size]
					break
				case 'KeyA':
				case 'ArrowLeft':
					if (this.to[0]) break
					this.to = [-size, 0]
					break
				case 'KeyD':
				case 'ArrowRight':
					if (this.to[0]) break
					this.to = [size, 0]
					break
			}
		})
	}

	checkBoundaryCollision(x: number, y: number) {
		const checkRight = x + size > this.wrapper?.width! - this.config.borderWidth!
		const checkLeft = x < this.config.borderWidth!
		const checkTop = y < this.config.borderWidth!
		const bottom = y + size > this.wrapper?.height! - this.config.borderWidth!
		return checkRight || checkLeft || checkTop || bottom
	}

	eatFoodHandler() {
		const {x, y} = this.snake[0]
		if (x === this.star!.x && y === this.star!.y) {
			this.addSnakeBody()
			this.updateScore()
			this.refreshStar()
		}
	}

	checkBodyPosition() {
		const [head, ...body] = this.snake
		return body.some((item) => item.x === head.x && item.y === head.y)
	}

	moveSnake() {
		const [head, ...body] = this.snake;
		// 计算 head 移动位置
		const x = head.x! + this.to[0]
		const y = head.y! + this.to[1]

		// 边界碰撞检测
		if (this.checkBoundaryCollision(x, y) || this.checkBodyPosition()) {
			this.stop()
			return
		}

		// 先移动 body
		for (let i = body.length - 1; i >= 0; i--) {
			const pre = this.snake[i]
			body[i].set({x: pre.x, y: pre.y})
		}

		// 移动 head
		head.set({x, y})

		this.eatFoodHandler()
	}

	createStar() {
		const star = new Star({
			width: size,
			height: size,
			fill: 'yellow',
			stroke: 'red',
		})
		this.star = star
		this.wrapper?.add(star)
		this.refreshStar()
	}

	refreshStar() {
		const randomX = randomInt(this.config.borderWidth!, this.wrapper?.width! - this.config.borderWidth!)
		const randomY = randomInt(this.config.borderWidth!, this.wrapper?.height! - this.config.borderWidth!)
		const x = Math.floor(randomX / size) * size
		const y = Math.floor(randomY / size) * size
		this.star!.set({x, y})
	}

	updateScore() {
		this.score++;
		this.config.updateScore(this.score);
	}

	start() {
		clearInterval(this.timer!)
		this.createStar()
		this.timer = setInterval(() => {
			this.moveSnake()
		}, 200)
	}

	stop() {
		if (!this.timer) return
		clearInterval(this.timer!)
		this.timer = null
		message.warn(`游戏结束, 最终得分：${this.score}`)
	}

	runGame() {
		this.drawSnake()
		this.bindMovePositionEvent()
	}

	restart() {
		this.score = 0;
		this.config.updateScore(0)
		this.snake = []
		this.to = [size, 0]
		clearInterval(this.timer!)
		super.restart()
		this.start()
	}
}
