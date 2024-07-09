import {App, Box} from "leafer-ui";
import {isNil} from "./index.ts";

export type GameOptions = {
	width: number;
	height: number;
	x: number;
	y: number;
	borderWidth: number;
	[key: string]: any;
}

export default abstract class LeaferGame {
	app: App | null = null;
	wrapper: Box | null = null;
	private gameBox: HTMLElement | null = null;
	readonly view: string;
	readonly boxSize: number;
	private gameConfig: GameOptions | null = null;

	protected constructor(view: string, gameConfig: Partial<GameOptions> = {}) {
		this.view = view;
		this.boxSize = window.innerWidth > 500 ? 500 : window.innerWidth;
		this.init();
		this.initConfig(gameConfig)
		this.initGameWrapper()
	}

	private init() {
		const gameBox = document.createElement('div');
		gameBox.style.width = `100%`;
		gameBox.style.height = `${this.boxSize}px`;
		// 如果不重新创建元素，会导致重置后报错
		document.getElementById(this.view)!.appendChild(gameBox)
		// 初始化游戏 app
		this.createGameApp(gameBox);
		this.gameBox = gameBox
	}

	private initConfig(gameConfig: Partial<GameOptions>) {
		const borderWidth = isNil(gameConfig.borderWidth) ? 10 : gameConfig.borderWidth!;
		const defaultSize = this.boxSize;
		// 获取容器宽高
		const style = this.getComputedStyle(['width', 'height']);
		if (!Array.isArray(style)) return
		const [wrapperWidth, wrapperHeight] = style
		// box 的宽高
		const width = gameConfig.width || defaultSize
		const height = gameConfig.height || defaultSize
		// 计算居中偏移量
		const defaultX = (wrapperWidth / 2) - this.boxSize / 2
		const defaultY = (wrapperHeight / 2) - height / 2
		this.gameConfig = {
			...gameConfig,
			width,
			height,
			x: gameConfig.x || defaultX,
			y: gameConfig.y || defaultY,
			borderWidth,
		}
		// 修改内部容器宽高
		this.resetGameBoxHeight()
	}

	private resetGameBoxHeight() {
		if (!this.gameBox) return
		const height = this.getComputedStyle('height');
		this.gameBox.style.height = `${height}px`
	}

	private createGameApp(view: HTMLElement) {
		this.app = new App({
			view,
			fill: 'transparent',
			move: {
				disabled: true
			},
			zoom: {
				disabled: true
			}
		})
		this.app.tree = this.app.addLeafer();
	}

	private initGameWrapper() {
		if (!this.gameConfig) {
			throw new Error('游戏配置未加载成功')
		}
		const {width, height, x, y, borderWidth} = this.gameConfig
		this.wrapper = new Box({
			width: width,
			height: height,
			x,
			y,
			stroke: '#3aafff',
			strokeWidth: borderWidth,
			fill: 'transparent',
			overflow: 'hide'
		});
		this.app?.tree.add(this.wrapper)
	}

	get config() {
		return {...this.gameConfig}
	}

	set config(gameConfig: Partial<GameOptions>) {
		this.initConfig(gameConfig)
	}

	getComputedStyle(prop: string | string[]) {
		const viewDom = document.getElementById(this.view)
		if (!viewDom) return
		const style = window.getComputedStyle(viewDom)
		if (typeof prop === 'string') {
			const val = style[prop as keyof CSSStyleDeclaration]
			return typeof val === "string" ? Number.parseInt(val.replace(/px/, '')) : 0
		}
		if (Array.isArray(prop)) {
			return prop.map((key) => {
				const val = style[key as keyof CSSStyleDeclaration]
				return typeof val === "string" ? Number.parseInt(val.replace(/px/, '')) : 0
			})
		}
	}

	abstract runGame(): void

	restart() {
		// 销毁画布
		this.app?.clear()
		const gameBoxWrapper = document.getElementById(this.view)
		gameBoxWrapper?.removeChild(gameBoxWrapper?.children[0])
		// 初始化游戏
		this.init()
		this.resetGameBoxHeight()
		this.initGameWrapper()
		this.runGame()
	}
}
