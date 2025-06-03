<!--
 * @Author: zi.yang
 * @Date: 2024-07-06 14:16:02
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-07-06 14:40:14
 * @Description: 弹球游戏
 * @FilePath: /leafer-games/src/views/marbles/index.vue
-->
<script setup lang="ts">
import { nextTick, ref } from 'vue';

import GameContainer from '@/components/GameContainer.vue';

import MarblesGame from '.';

let marblesGame: MarblesGame | null = null;

const isFirstStart = ref(true);
const score = ref(0);

// 游戏标题
const gameTitle = '弹球游戏';

// 游戏操作说明
const gameInstructions = [
  '游戏目标：控制底部的挡板接住小球，击打星星获得分数。',
  '操作方法：使用键盘的左右方向键或A、D键控制挡板移动。',
  '游戏规则：小球碰到底部边界且没有被挡板接住时，游戏结束。',
  '得分规则：每击中一个星星得1分。',
  '提示：观察小球的运动轨迹，提前移动挡板到合适位置。',
];

function resetGame() {
  marblesGame = new MarblesGame('game-wrapper', {
    step: 5,
    size: [0, 420],
    updateScore: (val) => {
      score.value = val;
    },
  });
}

nextTick(() => resetGame());

function startGame() {
  isFirstStart.value = false;
  marblesGame?.start();
}

function restartGame() {
  marblesGame?.restart();
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
