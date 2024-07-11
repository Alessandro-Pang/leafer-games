import {Rect as LeaferRect, DragEvent, Ellipse as LeaferEllipse, Star} from "leafer-ui";
import LeaferGame from "../../game-core/LeaferGame.ts";
import {message} from "ant-design-vue";
import {UserGameConfig} from "../../game-core/GameGraph.ts";

type MarblesGameConfig = {
	step: number,
	updateScore: (val: number) => void
}


const randomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export default class MarblesGame extends LeaferGame<MarblesGameConfig> {
	ball: LeaferEllipse | null = null;
	board: LeaferRect | null = null;
	timer: number | null = null
	stars: Star[] = [];
	score: number = 0

	constructor(view: string, gameConfig: UserGameConfig<MarblesGameConfig>) {
		super(view, gameConfig);
		this.initGameMap();
	}

	bindBoardEvent(board: LeaferRect) {
		board.on(DragEvent.DRAG, (evt) => {
			const node = evt.target;
			if (!node || !this.wrapper) return
			const {width = 0, height = 0} = this.wrapper || {}
			node.y = height - node.height
			// 右边界检测
			if (node.x + node.width > width) {
				node.x = width - node.width
				return
			}
			// 左边界检测
			if (node.x < 0) {
				node.x = 0
				return
			}
		})
	}

	drawBoard() {
		if (!this.wrapper) return
		const width = 60
		const rect = new LeaferRect({
			height: 10,
			width,
			x: this.wrapper.width! / 2 - width / 2,
			y: this.wrapper.height! - 10,
			fill: 'blue',
			draggable: true,
			dragBounds: 'parent',
		})
		this.board = rect;
		this.wrapper.add(rect)
		this.bindBoardEvent(rect)
	}

	drawBall() {
		const step = this.config.step;
		// 让小球的初始轨迹随机一些
		const dx = Math.random() > 0.5 ? -step : step
		const ball = new LeaferEllipse({
			width: 20,
			height: 20,
			fill: 'red',
			y: this.wrapper.height! - 30,
			x: this.wrapper.width! / 2 - 10,
			data: {dx, dy: -step}
		})
		this.wrapper.add(ball)
		this.ball = ball
	}

	/**
	 * 让移动具有一定的随机性
	 * @param pos
	 */
	randomMove(pos: 'dx' | 'dy') {
		const cur = this.ball!.data[pos]
		const step = randomInt(2, 4)
		if (pos === 'dy') {
			if (this.ball!.y! > this.board!.height! - 100) {
				return cur > 0 ? step : -step;
			}
		}
		return Math.random() > 0.5 ? step : -step;
	}

	moveBall() {
		if (!this.ball) return
		const x = this.ball.x!;
		const y = this.ball.y!;
		// 底部检测
		if (y > this.wrapper.height! - this.board!.height! - this.ball.height!) {
			if (x + this.ball.width! > this.board!.x! && x < this.board!.x! + this.board!.width!) {
				this.ball.data.dy = -this.config.step
				this.ball.data.dx = this.randomMove('dx')
			} else if (y > this.wrapper!.height! - this.ball.height!) {
				this.stop()
				return
			}
		}
		if (x < this.ball.width!) {
			this.ball.data.dx = this.config.step
			this.ball.data.dy = this.randomMove('dy')
		}
		if (x > this.wrapper.width! - this.ball.width!) {
			this.ball.data.dx = -this.config.step
			this.ball.data.dy = this.randomMove('dy')
		}
		if (y < this.ball.height!) {
			this.ball.data.dx = this.randomMove('dx')
			this.ball.data.dy = this.config.step;
		}

		// 暴力寻找
		const starIndex = this.stars.findIndex((star) => {
			const x1 = star.x! < x && star.x! + star.width! > x
			const x2 = star.x! < x + this.ball!.width! && star.x! + star.width! > x + this.ball!.width!
			const y1 = star.y! < y && star.y! + star.height! > y
			const y2 = star.y! < y + this.ball!.height! && star.y! + star.height! > y + this.ball!.height!
			return(x1 && y1) || (x2 && y2) || (x1 && y2) || (x2 && y1)
		})
		if (starIndex > -1) {
			this.ball.data.dx *= -1;
			this.ball.data.dy *= -1;
			this.stars[starIndex].remove()
			this.stars.splice(starIndex,1)
			this.updateScore()
			this.createStar()
		}
		this.ball.set({x: x + this.ball.data.dx, y: y + this.ball.data.dy})
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
		})
		this.wrapper.add(star)
		this.stars.push(star)
	}

	updateScore() {
		this.score++;
		this.config.updateScore(this.score);
	}

	initStarList() {
		for (let i = 0; i < 10; i++) {
			this.createStar()
		}
	}

	start() {
		console.log(this)
		clearInterval(this.timer!)
		this.initStarList()
		this.timer = setInterval(() => {
			this.moveBall()
		}, 10)
	}

	stop() {
		if (!this.timer) return
		clearInterval(this.timer!)
		this.timer = null
		message.warn(`游戏结束, 最终得分：${this.score}`)
	}

	paused() {

	}

	resume() {
	}

	initGameMap() {
		this.drawBoard()
		this.drawBall()
	}

	restart() {
		this.score = 0;
		this.stars = []
		this.config.updateScore(0)
		clearInterval(this.timer!)
		super.restart()
		this.start()
	}
}
