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
	private hasMove = false;
	// 移动时的存储栈
	private afterMove: IUI[] = [];

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
		let n = 0
		while (value > 1) {
			value /= 2
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

	/**
	 * 数字方块移动逻辑
	 * @param block 移动的方块
	 * @param axis x轴 还是 y轴 移动
	 * @param computed 计算当前方块移动位置
	 */
	moveBlock(block: IUI, axis: 'x' | 'y', computed: (index: number) => number) {
		let [i, position, lastIdx] = [0, 0, -1];
		while (true) {
			position = computed(i);
			// 寻找同向是否方块
			const index = this.afterMove.findIndex((node) => {
				const another = axis === 'x' ? 'y' : 'x'
				return node[axis] === position && node[another] === block[another]
			});
			if (index === -1) break;
			lastIdx = index;
			i++;
		}

		if (block[axis]! !== position) {
			this.hasMove = true;
		}

		// 判断相邻方块是否是相同数字
		if (lastIdx > -1 && !this.afterMove[lastIdx].data!.isAdd) {
			const preBlock = this.afterMove[lastIdx];
			const value = preBlock.data!.cacheValue;

			if (value === block.data!.value) {
				this.updateBlock(preBlock);
				block.remove();
				return
			}
		}

		block[axis] = position;
		this.afterMove.push(block);
	}

	toTopMove() {
		this.wrapper!.children.sort((a, b) => a.y! - b.y!);
		const bw = this.config.borderWidth!;

		for (const block of this.blockList) {
			block.data!.cacheValue = block.data!.value;
			block.data!.isAdd = false;
			this.moveBlock(block, 'y', (i) => i * block.height! + i * 5 + (i + 1) * 5 + bw)
		}
	}

	toBottomMove() {
		this.wrapper!.children.sort((a, b) => b.y! - a.y!);
		const bw = this.config.borderWidth!;

		for (const block of this.blockList) {
			block.data!.cacheValue = block.data!.value;
			block.data!.isAdd = false;

			this.moveBlock(block, 'y', (i) => {
				return this.wrapper!.height! - ((i + 1) * block.height! + (i + 1) * 5 + i * 5 + bw);
			})
		}
	}

	toLeftMove() {
		this.wrapper!.children.sort((a, b) => a.x! - b.x!);
		const bw = this.config.borderWidth!;

		for (const block of this.blockList) {
			block.data!.cacheValue = block.data!.value;
			block.data!.isAdd = false;

			this.moveBlock(block, 'x', (i) => i * block.width! + i * 5 + (i + 1) * 5 + bw)
		}
	}

	toRightMove() {
		this.wrapper!.children.sort((a, b) => b.x! - a.x!);
		const bw = this.config.borderWidth!;

		for (const block of this.blockList) {
			block.data!.cacheValue = block.data!.value;
			block.data!.isAdd = false;

			this.moveBlock(block, 'x', (i) => {
				return this.wrapper!.width! - ((i + 1) * block.width! + (i + 1) * 5 + i * 5 + bw);
			})
		}
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
			this.afterMove = []
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
