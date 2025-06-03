<!--
 * @Author: zi.yang
 * @Date: 2024-07-06 14:16:02
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-06-04 01:27:18
 * @Description: 飞翔的小鸟
 * @FilePath: /leafer-games/src/views/fly-bird/index.vue
-->
<script setup lang="ts">
import { nextTick, ref } from 'vue';

import GameContainer from '@/components/GameContainer.vue';

import FlyBirdGame from '.';

let flyBirdGame: FlyBirdGame | null = null;

const isFirstStart = ref(true);
const score = ref(0);

// 游戏标题
const gameTitle = '飞翔的小鸟';

// 游戏操作说明
const gameInstructions = [
  '游戏目标：控制小鸟飞行，躲避障碍物，飞行距离越远得分越高。',
  '操作方法：点击屏幕或按空格键使小鸟向上飞行，不操作时小鸟会自然下落。',
  '游戏规则：小鸟碰到管道或地面时，游戏结束。',
  '得分规则：成功通过每一对管道得1分。',
  '提示：保持平稳的点击节奏，不要过快或过慢，观察管道间隙的位置提前调整高度。',
];

function resetGame() {
  flyBirdGame = new FlyBirdGame('game-wrapper', {
    borderWidth: 1,
    updateScore: (val) => {
      score.value = val;
    },
  });
}

nextTick(() => resetGame());

function startGame() {
  isFirstStart.value = false;
  flyBirdGame?.start();
}

function restartGame() {
  flyBirdGame?.restart();
}
</script>

<template>
  <GameContainer
    :title="gameTitle"
    :instructions="gameInstructions"
    :score="score"
    :is-first-start="isFirstStart"
    @start="startGame"
    @restart="restartGame"
  />
</template>

<style scoped>
/* 游戏特定样式可以在这里添加 */
</style>
