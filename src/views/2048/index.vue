<script setup lang="ts">
import {nextTick, ref} from "vue";
import SnakeGame from "./index.ts";
import {Button as AButton} from "ant-design-vue";

let snakeGame: SnakeGame | null = null

const isFirstStart = ref(true);
const score = ref(0)

function resetGame() {
  snakeGame = new SnakeGame('game-wrapper', {
    borderWidth: 10,
    updateScore: (val) => {
      score.value = val
    }
  })
}

nextTick(() => resetGame())

function startGame() {
  isFirstStart.value = false;
  snakeGame?.start()
}

function restartGame() {
  snakeGame?.restart()
}
</script>

<template>
  <div class="score-board">
    <div class="board">
      <span>分数：</span>
      <span class="score">{{ score }}</span>
    </div>
  </div>
  <div class="main">
    <div id="game-wrapper" style="width: 100%; height: 100%"></div>
  </div>
  <div style="text-align: center; margin: 20px 0">
    <a-button type="primary" @click="startGame" v-if="isFirstStart">开始游戏</a-button>
    <a-button type="primary" @click="restartGame" v-else>重新开始</a-button>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
}

.score-board {
  display: flex;
  justify-content: center;
}

.score-board > .board {
  height: 60px;
  width: 120px;
  text-align: center;
  line-height: 60px;
  background: #03d5fa;
  color: yellow;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 4px 4px 6px 0 rgba(0, 0, 0, .2);
}

.score-board > .board > .score {
  font-size: 24px;
  font-weight: 600;
}
</style>
