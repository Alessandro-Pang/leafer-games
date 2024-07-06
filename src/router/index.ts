import {createRouter, createWebHashHistory} from 'vue-router'

import Home from '../views/home/index.vue'
import Puzzle from '../views/puzzle/index.vue'
import Marbles from '../views/marbles/index.vue'

export const routes = [
	{path: '/', component: Home, meta: {title: '首页', hidden: true}},
	{path: '/puzzle', component: Puzzle, meta: {title: '拼图游戏'}},
	{path: '/marbles', component: Marbles, meta: {title: '弹球游戏'}},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
