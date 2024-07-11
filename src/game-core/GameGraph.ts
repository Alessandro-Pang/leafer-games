import {App, Box} from "leafer-ui";
import {isNil} from "../utils";

/**
 * 基础画布大小配置
 */
export type BaseSize = {
	width: number,
	height: number
}

/**
 * 通用画布大小配置
 */
export type SizeConfig = number | [number, number] | BaseSize

/**
 * 跨平台画布大小配置
 */
export type PlatformSizeConfig = {
	mobile?: SizeConfig,
	pc?: SizeConfig
}

/**
 * 用户配置
 */
export type UserGameConfig<T> = {
	size?: SizeConfig | PlatformSizeConfig;
	x?: number;
	y?: number;
	borderWidth?: number;
} & T

/**
 * 游戏画布属性
 */
export type GameGraphConfig<T> = {
	size: number[];
	x: number;
	y: number;
	borderWidth: number;
} & T

/**
 * 序列化画布大小
 * @param size
 */
function serializeSize(size: SizeConfig) {
	if (typeof size === 'number') return [size, size]
	if (Array.isArray(size)) return size;
	if (typeof size === 'object') {
		if (size.width !== undefined && size.height !== undefined) {
			return [size.width, size.height];
		}
	}
	return []
}

/**
 * 游戏基础地图
 */
export default abstract class GameGraph<T> {
	// app
	app: App = new App();
	// 外层包围盒
	bbox: Box = new Box();
	// 内层盒子
	wrapper: Box = new Box();
	// game box element
	private gameBox: HTMLElement | null = null;
	// 视图 id
	private readonly view: string;
	// 是否是移动端
	private readonly isMobile: boolean;
	// 用户配置
	private userGameConfig: UserGameConfig<T>
	// 游戏配置
	private gameGraphConfig: GameGraphConfig<T> = {} as GameGraphConfig<T>;

	protected constructor(view: string, userGameConfig: UserGameConfig<T>) {
		this.view = view;
		this.isMobile = window.innerWidth < 640;
		this.userGameConfig = userGameConfig;

		this.initConfig()
		this.initGameBox();
		this.initGameApp();
		this.initGameWrapper();
	}

	get config(): GameGraphConfig<T> {
		return {...this.gameGraphConfig}
	}

	set config(userGameConfig: UserGameConfig<T>) {
		this.userGameConfig = userGameConfig
		this.initConfig()
	}

	/**
	 * 初始化游戏盒子元素
	 * @private
	 */
	private initGameBox() {
		const gameBox = document.createElement('div');
		gameBox.style.width = `100%`;
		gameBox.style.height = `100%`;
		// 如果不重新创建元素，会导致重置后报错
		document.getElementById(this.view)!.appendChild(gameBox)
		this.gameBox = gameBox
	}

	/**
	 * 获取外层包围盒大小
	 */
	get getBBoxSize() {
		const size = this.userGameConfig.size
		// 获取容器宽高
		const style = this.getComputedStyle(['width', 'height']);
		const [wrapperWidth, wrapperHeight] = style
		// 默认宽高
		const defaultWidth = this.isMobile ? wrapperWidth : 500;
		const defaultHeight = this.isMobile ? wrapperHeight : 500;
		// 序列化 size
		if (!size) return [defaultWidth, defaultHeight]
		let serialize = serializeSize(size as SizeConfig)
		if (!serialize.length) {
			const platformSize = size as PlatformSizeConfig
			if (this.isMobile && platformSize.mobile) {
				serialize = serializeSize(platformSize.mobile)
			} else if (platformSize.pc) {
				serialize = serializeSize(platformSize.pc)
			}
		}
		const [width, height] = serialize
		return [width || defaultWidth, height || defaultHeight]
	}

	/**
	 * 初始化游戏配置
	 * @private
	 */
	private initConfig() {
		const ugc = this.userGameConfig;
		const [width, height] = this.getBBoxSize;
		const [w, h] = this.getComputedStyle(['width', 'height']);
		// 默认居中偏移量
		const defaultX = (w / 2) - width / 2
		const defaultY = (h / 2) - height / 2
		const ggc = this.gameGraphConfig
		this.gameGraphConfig = {
			...ggc,
			...ugc,
			size: [width, height],
			x: ugc.x || ggc.x || defaultX,
			y: ugc.y || ggc.y || defaultY,
			borderWidth: isNil(ugc.borderWidth) ? 10 : ugc.borderWidth!,
		}
	}

	/**
	 * 初始化 app
	 * @private
	 */
	private initGameApp() {
		if (!this.gameBox) {
			throw new Error('App 实例初始化失败，gameBox 生成失败！')
		}
		this.app = new App({
			view: this.gameBox,
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

	/**
	 * 初始化游戏包装器
	 * @private
	 */
	private initGameWrapper() {
		const {size, x, y, borderWidth: bw} = this.config
		const [width, height] = size;
		// 外层包围盒
		this.bbox = new Box({
			width,
			height,
			x,
			y,
			stroke: '#3aafff',
			strokeWidth: bw,
			fill: 'transparent',
		})
		// 内层容器
		this.wrapper = new Box({
			width: width - bw * 2,
			height: height - bw * 2,
			x: bw,
			y: bw,
			overflow: 'hide',
			fill: 'transparent',
		})
		this.bbox.add(this.wrapper);
		this.app.tree.add(this.bbox)
	}

	/**
	 * 获取计算属性
	 * @param prop
	 */
	getComputedStyle(prop: string): number
	getComputedStyle(prop: string[]): number[]
	getComputedStyle(prop: string | string[]): number | number[] {
		const viewDom = document.getElementById(this.view)
		if (!viewDom) return 0
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
		return 0
	}

	/**
	 * 初始化游戏地图（环境）
	 */
	abstract initGameMap(): void

	restart() {
		// 销毁画布
		this.app.clear();
		this.app.remove();
		const gameBoxWrapper = document.getElementById(this.view)
		gameBoxWrapper?.removeChild(gameBoxWrapper?.children[0])
		// 初始化游戏
		this.initGameBox();
		this.initGameApp();
		this.initGameWrapper();
		this.initGameMap();
	}
}
