import {type App, DropEvent, Rect as LeaferRect, DragEvent, Box, Rect} from "leafer-ui";
import type {IUI} from '@leafer-ui/interface'
import {message} from 'ant-design-vue';
import LeaferGame, {GameOptions} from "../../utils/app.ts";

export default class MarblesGame extends LeaferGame {
	constructor(view: string, gameConfig?: GameOptions) {
		super(view, gameConfig);
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
			fill: 'red',
			draggable: true,
			dragBounds: 'parent',
		})
		this.wrapper.add(rect)
		this.bindBoardEvent(rect)
	}

	runGame() {
		this.drawBoard()
	}
}
