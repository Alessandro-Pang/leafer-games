import {DropEvent, Rect as LeaferRect, DragEvent} from "leafer-ui";
import type {IUI} from '@leafer-ui/interface'
import {message} from 'ant-design-vue';
import LeaferGame, {GameOptions} from "../../utils/app.ts";

type PuzzleGameOption = {
	count: number,
	url: string
} & Partial<GameOptions>

export default class PuzzleGame extends LeaferGame {
	private images: IUI[] = [];

	constructor(view: string, gameConfig: PuzzleGameOption) {
		super(view, gameConfig);
		if (!gameConfig.url) return
		this.runGame()
	}

	runGame() {
		if (!this.wrapper) return
		for (let i = 0; i < Math.pow(this.config.count, 2); i++) {
			const image = this.createImage(i, this.config.count);
			this.images.push(image)
			this.wrapper.add(image);
		}
		this.shuffleImages()
	}

	/**
	 * 创建图片节点
	 * @param idx
	 * @param count
	 */
	createImage(idx: number, count: number) {
		const borderWidth = this.config.borderWidth || 0;
		const width = (this.config.width! - borderWidth * 2) / count;
		const height = (this.config.height! - borderWidth * 2) / count;
		const x = (idx % count) * width;
		const y = Math.floor(idx / count) * height;
		return new LeaferRect({
			width,
			height,
			x: x + borderWidth,
			y: y + borderWidth,
			fill: {
				type: 'image',
				url: this.config.url,
				mode: 'clip',
				offset: {x: -x, y: -y}
			},
			data: {sortId: idx},
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
		const imagePos = this.images.map(item => ({x: item.x, y: item.y}))
		this.wrapper.children.sort(() => Math.random() > Math.random() ? -1 : 1)
		this.wrapper.children.forEach((node: IUI, idx) => {
			node.set(imagePos[idx])
			node.data!.current = idx;
			this.bindMoveImageEvent(node as LeaferRect)
		})
		this.images = [...this.wrapper.children]
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
			if (!node) return
			node.zIndex = 10000;
			x = node.x;
			y = node.y;
			dragNode = node;
			DragEvent.setData({x, y, dragNode})
		})

		image.on(DropEvent.DROP, (evt) => {
			const node = evt.target
			const {x, y, dragNode} = evt.data || {}

			if (!node || !dragNode) return
			// 校验是否斜角移动
			if (node.x !== dragNode.x && node.y !== dragNode.y) return
			// 校验 x 移动格数
			if (node.x >= dragNode.x + (dragNode.width * 2) || node.x < dragNode.x - dragNode.width) {
				return
			}
			// 校验 y 移动格数
			if (node.y >= dragNode.y + (dragNode.height * 2) || node.y < dragNode.y - dragNode.height) {
				return
			}
			// 交换数组位置
			const targetIdx = node.data.current;
			const dragNodeIdx = dragNode.data.current;
			dragNode.data.current = targetIdx;
			node.data.current = dragNodeIdx;
			this.images[targetIdx] = dragNode;
			this.images[dragNodeIdx] = node;
			// 交换节点位置
			dragNode.set({x: node.x, y: node.y});
			node.set({x, y});
			// 检查是否成功
			if (this.checkSort()) {
				message.success('恭喜你，完成拼图')
				this.images.forEach((item) => {
					item.draggable = false
					item.off()
				})
			}
		})

		image.on(DragEvent.END, () => {
			if (!dragNode) return
			dragNode.set({zIndex: 1, x, y})
			dragNode = null;
		})
	}

	/**
	 * 检查排序
	 */
	checkSort() {
		return this.images.every((item) => item.data!.current === item.data!.sortId);
	}

	/**
	 * 重置游戏
	 * @param gameConfig
	 */
	resetGame(gameConfig: PuzzleGameOption) {
		this.images = []
		this.config = gameConfig;
		this.restart()
	}
}
