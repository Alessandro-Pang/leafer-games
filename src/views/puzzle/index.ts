import {type App, DropEvent, Rect as LeaferRect, DragEvent, Box} from "leafer-ui";
import type {IUI} from '@leafer-ui/interface'
import {message} from 'ant-design-vue';

let images: IUI[] = [];

type WrapperConfig = {
	width: number;
	height: number;
	x: number;
	y: number;
	borderWidth: number;
	url: string;
}
export let gameConfig: WrapperConfig = {} as WrapperConfig

/**
 * 获取容器配置
 * @param option
 */
function initGameConfig(option: GameOption) {
	const width = option.width || 500;
	const height = option.height || 500;
	gameConfig = {
		width,
		height,
		x: 0,
		y: 0,
		borderWidth: option.borderWidth || 20,
		url: option.url || `https://picsum.photos/${width}/${height}`
	}
	// 重置图片队列
	images.length = 0
	images = []
	return gameConfig
}

/**
 * 创建游戏容器
 */
function createGameWrapper(): Box {
	const {width, height, x, y, borderWidth} = gameConfig
	return new Box({
		width: width + borderWidth,
		height: height + borderWidth,
		x,
		y,
		stroke: '#3aafff',
		strokeWidth: borderWidth / 2,
		fill: 'transparent',
	});
}

/**
 * 创建图片节点
 * @param idx
 * @param count
 */
function createImage(idx: number, count: number) {
	const width = gameConfig.width / count;
	const height = gameConfig.height / count;
	const x = (idx % count) * width;
	const y = Math.floor(idx / count) * height;
	return new LeaferRect({
		width,
		height,
		x: x + gameConfig.borderWidth / 2,
		y: y + gameConfig.borderWidth / 2,
		fill: {
			type: 'image',
			url: gameConfig.url ,
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
 * 检查排序
 */
function checkSort() {
	return images.every((item) => item.data!.current === item.data!.sortId);
}

/**
 * 绑定图片移动事件
 * @param image
 */
function bindMoveImageEvent(image: LeaferRect) {
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
		images[targetIdx] = dragNode;
		images[dragNodeIdx] = node;
		// 交换节点位置
		dragNode.set({x: node.x, y: node.y});
		node.set({x, y});
		// 检查是否成功
		if (checkSort()) {
			message.success('恭喜你，完成拼图')
			images.forEach((item) => {
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
 * 打乱拼图排序
 * @param wrapper
 */
export function shuffleImages(wrapper: Box) {
	if (!wrapper) return;
	const imagePos = images.map(item => ({x: item.x, y: item.y}))
	wrapper.children.sort(() => Math.random() > Math.random() ? -1 : 1)
	wrapper.children.forEach((node: IUI, idx) => {
		node.set(imagePos[idx])
		node.data!.current = idx;
		bindMoveImageEvent(node as LeaferRect)
	})
	images = [...wrapper.children]
}


type GameOption = {
	count: number;
	width?: number;
	height?: number;
	borderWidth?: number;
	url?: string;
}

/**
 * 初始化拼图
 * @param app
 * @param option
 */
export function init(app: App, option: GameOption) {
	initGameConfig(option)
	const wrapper = createGameWrapper();
	app.tree.add(wrapper)
	for (let i = 0; i < Math.pow(option.count, 2); i++) {
		const image = createImage(i, option.count);
		images.push(image)
		wrapper.add(image);
	}
	shuffleImages(wrapper)
	return {wrapper, app}
}
