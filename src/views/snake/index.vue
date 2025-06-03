<!--
 * @Author: zi.yang
 * @Date: 2024-07-06 14:16:02
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-07-06 14:42:03
 * @Description: 贪吃蛇
 * @FilePath: /leafer-games/src/views/snake/index.vue
-->
<script setup lang="ts">
import { nextTick, ref } from 'vue';

import GameContainer from '@/components/GameContainer.vue';

import SnakeGame from '.';

let snakeGame: SnakeGame | null = null;

const isFirstStart = ref(true);
const score = ref(0);

// 游戏标题
const gameTitle = '贪吃蛇';

// 游戏操作说明
const gameInstructions = [
  '游戏目标：控制蛇吃掉食物，让蛇变得越来越长。',
  '操作方法：使用键盘的上下左右方向键或W、A、S、D键控制蛇的移动方向。',
  '游戏规则：蛇碰到自己的身体或游戏边界时，游戏结束。',
  '得分规则：每吃掉一个食物得1分。',
  '提示：随着蛇的长度增加，游戏难度会逐渐提高，需要更加谨慎地规划移动路径。',
];

function resetGame() {
  snakeGame = new SnakeGame('game-wrapper', {
    updateScore: (val) => {
      score.value = val;
    },
  });
}

nextTick(() => resetGame());

function startGame() {
  isFirstStart.value = false;
  snakeGame?.start();
}

function restartGame() {
  snakeGame?.restart();
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
