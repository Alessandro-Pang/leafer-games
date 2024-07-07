import {Rect as LeaferRect, DragEvent, Ellipse as LeaferEllipse} from "leafer-ui";
import LeaferGame, {GameOptions} from "../../utils/LeaferGame.ts";
import {message} from "ant-design-vue";

type MarblesGameConfig = {
	step: number
} & Partial<GameOptions>

export default class MarblesGame extends LeaferGame {
	ball: LeaferEllipse | null = null;
	board: LeaferRect | null = null;
	timer: number | null = null

	constructor(view: string, gameConfig: MarblesGameConfig) {
		super(view, gameConfig);
		this.runGame()
	}

	bindBoardEvent(board: LeaferRect) {
		board.on(DragEvent.DRAG, (evt) => {
			const node = evt.target;
			if (!node || !this.wrapper) return
			const {width = 0, height = 0} = this.wrapper || {}
			node.y = height - 20
			const strokeWidth = this.wrapper.strokeWidth as number
			// 右边界检测
			if (node.x + node.width > width - strokeWidth) {
				node.x = width - node.width - strokeWidth
				return
			}
			// 左边界检测
			if (node.x < strokeWidth) {
				node.x = strokeWidth
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
			y: this.wrapper.height! - 20,
			fill: 'blue',
			draggable: true,
			dragBounds: 'parent',
		})
		this.board = rect;
		this.wrapper.add(rect)
		this.bindBoardEvent(rect)
	}

	drawBall() {
		if (!this.wrapper) return
		const ball = new LeaferEllipse({
			width: 20,
			height: 20,
			fill: 'red',
			y: this.wrapper.height! - 40,
			x: this.wrapper.width! / 2 - 10,
			data: {dx: -this.config.step, dy: -this.config.step}
		})
		this.wrapper.add(ball)
		this.ball = ball
	}

	randomMove(){
		return Number.parseInt((Math.random() * 10 + 1).toString(), 10)
	}

	moveBall() {
		if (!this.ball || !this.wrapper) return
		const strokeWidth = this.wrapper.strokeWidth! as number
		const x = this.ball.x! + this.ball.data.dx;
		const y = this.ball.y! + this.ball.data.dy;
		// 底部检测
		if (y > this.wrapper!.height! - strokeWidth * 2 - this.board!.height!) {
			if(x + this.ball.width > this.board!.x! && x < this.board!.x! + this.board!.width!) {
				this.ball.data.dy = -this.config.step
			}else if (y > this.wrapper!.height! - strokeWidth * 2){
				this.stop()
				return
			}
		}
		if(x < strokeWidth - 2) {
			this.ball.data.dx = this.config.step
		}
		if(x > this.wrapper!.width! - strokeWidth * 2 - 2) {
			this.ball.data.dx = -this.config.step
		}
		if(y < strokeWidth - 2) {
			this.ball.data.dy = this.config.step;
		}
		this.ball.set({x, y})
	}

	start() {
		this.timer = setInterval(() => {
			this.moveBall()
		}, 10)
	}

	stop() {
		clearInterval(this.timer!)
		message.warn('游戏结束')
	}
	runGame() {
		this.drawBoard()
		this.drawBall()
		this.start()
	}
}
