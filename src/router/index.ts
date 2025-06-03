import { createRouter, createWebHashHistory } from 'vue-router';

import Home from '../views/home/index.vue';

export const routes = [
  { path: '/', component: Home, meta: { title: '首页', hidden: true } },
  {
    path: '/puzzle',
    component: () => import('../views/puzzle/index.vue'),
    meta: {
      title: '拼图游戏',
      icon: '/src/assets/puzzle/puzzle.svg',
      description: '挑战你的空间思维，将打乱的图像重新拼凑完整。',
    },
  },
  {
    path: '/marbles',
    component: () => import('../views/marbles/index.vue'),
    meta: {
      title: '弹球游戏',
      icon: '/src/assets/marbles/marbles.svg',
      description: '控制弹球击打目标，考验你的反应能力和精准度。',
    },
  },
  {
    path: '/snake',
    component: () => import('../views/snake/index.vue'),
    meta: {
      title: '贪吃蛇',
      icon: '/src/assets/snake/snake.svg',
      description: '经典的贪吃蛇游戏，不断成长，但不要撞到自己！',
    },
  },
  {
    path: '/fly-bird',
    component: () => import('../views/fly-bird/index.vue'),
    meta: {
      title: '飞翔的小鸟',
      icon: '/src/assets/fly-bird/bird.svg',
      description: '控制小鸟飞行，躲避障碍物，看看你能飞多远！',
    },
  },
  {
    path: '/2048',
    component: () => import('../views/2048/index.vue'),
    meta: {
      title: '2048',
      icon: '/src/assets/2048/2048.svg',
      description: '合并相同数字，挑战你的策略思维，能否达到2048？',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
