import {App, Box} from "leafer-ui";

export function createGraph(view: HTMLElement) {
	const app = new App({
		view,
		fill: 'transparent',
		move: {
			disabled: true
		},
		zoom: {
			disabled: true
		}
	})
	app.tree = app.addLeafer();
	return app;
}


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
		gameBox.style.height = `100%`;
		// 如果不重新创建元素，会导致重置后报错
		document.getElementById(this.view)!.appendChild(gameBox)
		// 初始化游戏 app
		this.createGameApp(gameBox);
	}

	private initConfig(gameConfig: Partial<GameOptions>) {
		const borderWidth = gameConfig.borderWidth || 10;
		const defaultSize = this.boxSize - borderWidth;
		const style = this.getComputedStyle(['width', 'height']);
		if (!Array.isArray(style)) return
		const [width, height] = style
		const defaultX = (width / 2) - this.boxSize / 2
		const defaultY = (height / 2) - this.boxSize / 2
		this.gameConfig = {
			...gameConfig,
			width: gameConfig.width || defaultSize,
			height: gameConfig.height || defaultSize,
			x: gameConfig.x || defaultX,
			y: gameConfig.y || defaultY,
			borderWidth,
		}
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
			width: width + borderWidth * 2,
			height: height + borderWidth * 2,
			x,
			y,
			stroke: '#3aafff',
			strokeWidth: borderWidth,
			fill: 'transparent',
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
		this.initGameWrapper()
		this.runGame()
	}
}
