import {App} from "leafer-ui";

export function createGraph(view: HTMLElement) {
	const app = new App({
		view,
		fill: 'transparent',
		move: {
			disabled: true
		},
		zoom:{
			disabled: true
		}
	})
	app.tree = app.addLeafer();
	return app;
}
