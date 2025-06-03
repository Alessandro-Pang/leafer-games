<!--
 * @Author: zi.yang
 * @Date: 2024-07-06 14:16:02
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-07-06 14:41:25
 * @Description: 2048
 * @FilePath: /leafer-games/src/views/2048/index.vue
-->
<script setup lang="ts">
import { nextTick, ref } from 'vue';

import GameContainer from '@/components/GameContainer.vue';

import Play2048Game from '.';

let play2048Game: Play2048Game | null = null;

const isFirstStart = ref(true);
const score = ref(0);

// 游戏标题
const gameTitle = '2048';

// 游戏操作说明
const gameInstructions = [
  '游戏目标：通过合并相同数字的方块，尝试得到数字2048的方块。',
  '操作方法：使用键盘的上下左右方向键或W、A、S、D键控制所有方块的移动方向。',
  '游戏规则：每次移动，所有方块会向指定方向滑动，相同数字的方块相撞时会合并成为它们的和。',
  '得分规则：每次合并方块时，得分增加合并后的数字值。',
  '提示：策略性地规划你的移动，保持大数字在角落，并保持棋盘整洁以获得更高分数。',
];

function resetGame() {
  play2048Game = new Play2048Game('game-wrapper', {
    borderWidth: 10,
    size: {
      mobile: [window.innerWidth, window.innerWidth],
    },
    updateScore: (val) => {
      score.value = val;
    },
  });
}

nextTick(() => resetGame());

function startGame() {
  isFirstStart.value = false;
  play2048Game?.start();
}

function restartGame() {
  play2048Game?.restart();
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
