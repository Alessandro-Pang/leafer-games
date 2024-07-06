import {createRouter, createWebHistory} from 'vue-router'

import Home from '../views/home/index.vue'
import Puzzle from '../views/puzzle/index.vue'

export const routes = [
	{path: '/', component: Home, meta: {title: '首页'}},
	{path: '/puzzle', component: Puzzle, meta: {title: '拼图游戏'}},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
