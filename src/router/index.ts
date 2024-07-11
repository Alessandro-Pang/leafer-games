import {createRouter, createWebHashHistory} from 'vue-router'

import Home from '../views/home/index.vue'

export const routes = [
	{path: '/', component: Home, meta: {title: '首页', hidden: true}},
	{path: '/puzzle', component: () => import('../views/puzzle/index.vue'), meta: {title: '拼图游戏'}},
	{path: '/marbles', component: () => import('../views/marbles/index.vue'), meta: {title: '弹球游戏'}},
	{path: '/snake', component: () => import('../views/snake/index.vue'), meta: {title: '贪吃蛇'}},
	{path: '/fly-bird', component: () => import('../views/fly-bird/index.vue'), meta: {title: '飞翔的小鸟'}},
	{path: '/2048', component: () => import('../views/2048/index.vue'), meta: {title: '2048'}},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
