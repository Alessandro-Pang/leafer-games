import {PointerEvent, Box, Text} from "leafer-ui";
import LeaferGame, {GameOptions} from "../../utils/LeaferGame.ts";
import {randomInt} from "../../utils";
import {IUI} from "@leafer-ui/interface";
import {message} from "ant-design-vue";

type MarblesGameConfig = {
	updateScore: (val: number) => void
} & Partial<GameOptions>

const colorList = ['#eee4da', '#ede0c8', '#f2b179', '#f59563', '#f67c5f', '#f65e3b', '#edcf72', '#edcc61', '#edc850', '#edc53f', '#edc22e']


export default class FlyBirdGame extends LeaferGame {
	private score: number = 0;
	private max: number = 2;
	private hasMove = false

	constructor(view: string, gameConfig: MarblesGameConfig) {
		super(view, gameConfig);
		this.runGame()
	}

	get gridSize() {
		const width = this.wrapper!.width! - this.config.borderWidth! * 2
		return width / 4;
	}

	get gridList(): IUI[] {
		return this.wrapper?.children.filter((node) => node.data!.type === 'grid') || []
	}

	get blockList(): IUI[] {
		return this.wrapper?.children.filter((node) => node.data!.type === 'block') || []
	}

	computed(value: number) {
		let max = value;
		let n = 0
		while (max > 1) {
			max /= 2
			n++;
		}
		return n
	}

	addNumberBlock() {
		const randomGrid = this.gridList[randomInt(0, this.gridList.length - 1)]
		const size = this.gridSize - 10
		const x = randomGrid.x! + 5;
		const y = randomGrid.y! + 5;
		// 当前位置是否已存在
		const isExists = this.blockList.some((block) => block.x === x && block.y === y)
		if (isExists) {
			this.addNumberBlock()
			return
		}
		const value = 2//Math.pow(2, randomInt(1, 10))
		// 创建数字方块
		const block = new Box({
			width: size,
			height: size,
			x,
			y,
			fill: '#eee4da',
			cornerRadius: 6,
			data: {type: 'block', value: value, cacheValue: value},
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
				fontFamily: 'clear sans,helvetica neue,Arial,sans-serif'
			}]
		})
		this.wrapper?.add(block)
	}

	drawGrid() {
		if (!this.wrapper) return
		const borderWidth = this.config.borderWidth!
		for (let i = 0; i < Math.pow(4, 2); i++) {
			const gridBox = new Box({
				width: this.gridSize,
				height: this.gridSize,
				x: (i % 4) * this.gridSize + borderWidth,
				y: Math.floor(i / 4) * this.gridSize + borderWidth,
				data: {type: 'grid'},
				zIndex: 1,
				children: [{
					tag: 'Rect',
					width: this.gridSize - 10,
					height: this.gridSize - 10,
					x: 5,
					y: 5,
					fill: '#EEE4DA59',
					cornerRadius: 6
				}]
			})
			this.wrapper.add(gridBox)
		}
	}

	updateBlock(block: IUI) {
		const value = block.data!.value;
		const newValue = value * 2
		this.max = Math.max(this.max, newValue)

		const idx = this.computed(newValue) - 1
		block.set({
			fill: colorList[idx],
			data: {...block.data, value: newValue, cacheValue: value, isAdd: true}
		})
		const text = block.children![0] as Text
		text.set({
			fill: newValue > 8 ? '#f9f6f2' : '#776e65',
			text: `${newValue}`
		})
		this.updateScore(newValue)
	}

	toTopMove() {
		this.wrapper!.children.sort((a, b) => a.y! - b.y!)
		const afterMove: IUI[] = []
		const bw = this.config.borderWidth!

		this.blockList.forEach((block) => {
			let [i, y, index, lastIdx] = [0, 0, 0, -1]
			block.data!.cacheValue = block.data!.value;
			block.data!.isAdd = false;
			while (index !== -1) {
				y = i * block.height! + i * 5 + (i + 1) * 5 + bw
				index = afterMove.findIndex((node) => node.x === block.x && node.y === y)
				lastIdx = index === -1 ? lastIdx : index
				i++;
			}
			if (block.y !== y) {
				this.hasMove = true
			}
			if (lastIdx > -1 && !afterMove[lastIdx].data!.isAdd) {
				const preBlock = afterMove[lastIdx]
				const value = preBlock.data!.cacheValue;
				if (value === block.data!.value) {
					this.updateBlock(preBlock)
					block.remove()
					return
				}
			}
			block.y = y
			afterMove.push(block)
		})
	}

	toBottomMove() {
		this.wrapper!.children.sort((a, b) => b.y! - a.y!)
		const afterMove: IUI[] = []
		const bw = this.config.borderWidth!

		this.blockList.forEach((block) => {
			let [i, y, index, lastIdx] = [0, 0, 0, -1]
			block.data!.cacheValue = block.data!.value;
			block.data!.isAdd = false;
			while (index !== -1) {
				i++;
				y = this.wrapper!.height! - (i * block.height! + i * 5 + (i - 1) * 5 + bw)
				index = afterMove.findIndex((node) => node.x === block.x && node.y === y)
				lastIdx = index === -1 ? lastIdx : index
			}
			if (block.y !== y) {
				this.hasMove = true
			}
			if (lastIdx > -1 && !afterMove[lastIdx].data!.isAdd) {
				const preBlock = afterMove[lastIdx]
				const value = preBlock.data!.cacheValue;
				if (value === block.data!.value) {
					this.updateBlock(preBlock)
					block.remove()
					return
				}
			}
			block.y = y
			afterMove.push(block)
		})
	}

	toLeftMove() {
		this.wrapper!.children.sort((a, b) => a.x! - b.x!)
		const afterMove: IUI[] = []
		const bw = this.config.borderWidth!
		this.blockList.forEach((block) => {
			let [i, x, index, lastIdx] = [0, 0, 0, -1]
			block.data!.cacheValue = block.data!.value;
			block.data!.isAdd = false;
			while (index !== -1) {
				x = i * block.width! + i * 5 + (i + 1) * 5 + bw
				index = afterMove.findIndex((node) => node.x === x && node.y === block.y)
				lastIdx = index === -1 ? lastIdx : index
				i++;
			}
			if (block.x !== x) {
				this.hasMove = true
			}
			if (lastIdx > -1 && !afterMove[lastIdx].data!.isAdd) {
				const preBlock = afterMove[lastIdx]
				const value = preBlock.data!.cacheValue;
				if (value === block.data!.value) {
					this.updateBlock(preBlock)
					block.remove()
					return
				}
			}
			block.x = x
			afterMove.push(block)
		})
	}

	toRightMove() {
		this.wrapper!.children.sort((a, b) => b.x! - a.x!)
		const afterMove: IUI[] = []
		const bw = this.config.borderWidth!

		this.blockList.forEach((block) => {
			let [i, x, index, lastIdx] = [0, 0, 0, -1]
			block.data!.cacheValue = block.data!.value;
			block.data!.isAdd = false;
			while (index !== -1) {
				i++;
				x = this.wrapper!.width! - (i * block.width! + i * 5 + (i - 1) * 5 + bw)
				index = afterMove.findIndex((node) => node.x === x && node.y === block.y)
				lastIdx = index === -1 ? lastIdx : index
			}
			if (block.x !== x) {
				this.hasMove = true
			}
			if (lastIdx > -1 && !afterMove[lastIdx].data!.isAdd) {
				const preBlock = afterMove[lastIdx]
				const value = preBlock.data!.cacheValue;
				if (value === block.data!.value) {
					this.updateBlock(preBlock)
					block.remove()
					return
				}
			}
			block.x = x
			afterMove.push(block)
		})
	}


	/**
	 * 绑定方向滑动事件
	 */
	bindTapMoveEvent() {
		if (!this.wrapper) return
		let isDown = false;
		let downPos = {x: 0, y: 0}
		this.wrapper.on(PointerEvent.DOWN, (evt) => {
			this.hasMove = false
			isDown = true;
			const pos = {x: evt.x, y: evt.y};
			this.wrapper?.worldToInner(pos);
			downPos = {...pos};
		})

		this.wrapper.on(PointerEvent.MOVE, (evt) => {
			if (!isDown) return
			const pos = {x: evt.x, y: evt.y};
			this.wrapper?.worldToInner(pos);
			// 只有拖拽移动距离大于 60 时，才进行移动
			if (Math.abs(pos.x - downPos.x) > 60) {
				isDown = false
				pos.x - downPos.x > 0 ? this.toRightMove() : this.toLeftMove()
			} else if (Math.abs(pos.y - downPos.y) > 60) {
				isDown = false
				pos.y - downPos.y > 0 ? this.toBottomMove() : this.toTopMove()
			}
			if (this.hasMove) {
				this.addNumberBlock()
			}
		})

		this.wrapper.on(PointerEvent.UP, () => {
			isDown = false;
			downPos = {x: 0, y: 0}
			if (this.checkGameOver()) {
				this.stop()
			}
		})
	}

	checkGameOver() {
		const len = this.blockList.length;
		if (len !== 16) return false;
		// 从上到下，从左到右排序
		// 这样我们就可以通过下标 i % 4 == (0, 3) 获取每行数据， Math.floor(i / 4) 获取每列数据
		// 变相形成二维数组，同时我们只需要从左向右，从上到下检查是否有相同的即可。
		this.wrapper?.children.sort((a, b) => {
			return a.y! - b.y! === 0 ? a.x! - b.x! : a.y! - b.y!
		});
		for (let i = 0; i < len; i++) {
			const col = i % 4;
			const row = Math.floor(i / 4)
			const currentVal = this.blockList[i]?.data!.value;
			const rightVal = col !== 3 ? this.blockList[i + 1]?.data!.value : -1;
			const bottomVal = row !== 4 ? this.blockList[i + 4]?.data!.value : -1;
			if (currentVal === rightVal || currentVal === bottomVal) return false
		}
		return true;
	}

	updateScore(score: number) {
		this.score += score;
		this.config.updateScore(this.score);
	}

	start() {
		this.bindTapMoveEvent()
	}

	stop() {
		this.wrapper!.off()
		message.warn(`游戏结束, 最终得分：${this.score}`)
	}

	runGame() {
		this.wrapper!.set({
			fill: '#bbada0',
			cornerRadius: 8,
			stroke: '#bbada0'
		})
		this.drawGrid()
		this.addNumberBlock()
		this.addNumberBlock()
	}

	restart() {
		this.score = 0;
		this.config.updateScore(0)
		super.restart()
		this.start()
	}
}
