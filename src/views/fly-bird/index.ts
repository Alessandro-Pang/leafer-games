import {Rect as LeaferRect, PointerEvent} from "leafer-ui";
import LeaferGame, {GameOptions} from "../../utils/LeaferGame.ts";
import {message} from "ant-design-vue";
import birdImg from '../../assets/fly-bird/bird.svg'
import {randomInt} from "../../utils";

type MarblesGameConfig = {
	updateScore: (val: number) => void
} & Partial<GameOptions>

export default class FlyBirdGame extends LeaferGame {
	private runStatus: boolean = false;
	private score: number = 0;
	private bird: LeaferRect | null = null;
	private wallList: LeaferRect[][] = [];

	private mainAnimateId: number | null = null;
	private speed = 2;
	private startTime = 0;

	constructor(view: string, gameConfig: MarblesGameConfig) {
		super(view, gameConfig);
		this.runGame()
	}

	birdDownEvent() {
		if (!this.runStatus || !this.bird) return
		this.bird.y! += this.speed
		// 边界检测
		const bw = this.config.borderWidth!
		const height = this.wrapper?.height! - bw;
		if (this.bird.y! + this.bird.height! >= height) {
			this.bird.y = height - this.bird.height!
		} else if (this.bird.y! <= bw) {
			this.bird.y = bw
		}
	}

	bindUpFlyEvent() {
		this.wrapper?.on(PointerEvent.DOWN, () => {
			if (!this.runStatus) return
			this.speed -= 8
		})

		this.wrapper?.on(PointerEvent.UP, () => {
			if (!this.runStatus) return
			this.speed = 2
		})
	}

	drawBird() {
		const bird = new LeaferRect({
			width: 50,
			height: 50,
			x: 50,
			y: 200,
			fill: {
				type: 'image',
				url: birdImg
			}
		})
		this.bird = bird
		this.wrapper?.add(bird)
	}

	check(index: number) {
		const [topWall, bottomWall] = this.wallList[index]
		const {x = 0, y = 0, height = 0, width = 0} = this.bird!
		if (topWall.x! + topWall.width! * 0.6 <= x) return false;
		const top = y < topWall.height! && x + width >= topWall.x!;
		const bottom = y + height > bottomWall.y! && x + width >= topWall.x!;
		return top || bottom
	}

	moveWall() {
		if (!this.runStatus) return
		const borderWidth = this.config.borderWidth || 0;
		this.wallList.forEach(([topWall, bottomWall], index) => {
			if (this.check(index)) {
				this.stop()
				return
			}

			if (topWall.x! + topWall.width! < borderWidth) {
				topWall.remove()
				bottomWall.remove()
				this.wallList.splice(index, 1)
				return
			}

			// 根据最后一个的位置，新增墙
			if (index === this.wallList.length - 1) {
				if (topWall.x! < this.wrapper?.width! / 2) {
					this.drawWall(this.wrapper!.width!)
				}
			}

			topWall.x! -= 1
			bottomWall.x! -= 1
		})
	}

	drawWall(x: number) {
		const spaceSize = 150
		const bw = this.config.borderWidth || 0
		const height = this.wrapper?.height! - bw;
		const topWallHeight = randomInt(50, 300)
		const topWall = new LeaferRect({
			width: 50,
			height: topWallHeight,
			x,
			y: bw,
			fill: '#333'
		})

		const bottomWall = new LeaferRect({
			width: 50,
			height: height - topWallHeight - spaceSize,
			x,
			y: topWallHeight + spaceSize,
			fill: '#333'
		})
		this.wallList.push([topWall, bottomWall])
		this.wrapper?.add(topWall)
		this.wrapper?.add(bottomWall)
	}

	updateScore() {
		const time = Date.now() - this.startTime
		this.score = Math.floor(time / 1000);
		this.config.updateScore(this.score);
	}

	start() {
		this.runStatus = true;
		this.startTime = Date.now();
		this.birdDownEvent()
		this.runAnimate()
	}

	runAnimate() {
		if (!this.runStatus) return
		this.mainAnimateId = window.requestAnimationFrame(() => {
			this.moveWall()
			this.birdDownEvent()
			this.updateScore()
			this.runAnimate()
		})
	}

	cancelAnimate() {
		if (this.mainAnimateId) {
			window.cancelAnimationFrame(this.mainAnimateId);
		}
		this.mainAnimateId = null;
		this.runStatus = false
	}

	stop() {
		this.cancelAnimate()
		message.warn(`游戏结束, 最终得分：${this.score}`)
	}

	runGame() {
		this.drawBird()
		this.drawWall(400)
		this.bindUpFlyEvent()
	}

	restart() {
		this.speed = 2;
		this.score = 0;
		this.wallList = []
		this.config.updateScore(0)
		this.cancelAnimate()
		super.restart()
		this.start()
	}
}
