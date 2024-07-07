<script setup lang="ts">
import {nextTick, ref} from "vue";
import MarblesGame from "./index.ts";
import {
  Spin as ASpin,
  Button as AButton,
} from "ant-design-vue";

let marblesGame: MarblesGame | null = null

const isFirstStart = ref(true);

function resetGame() {
  marblesGame = new MarblesGame('game-wrapper', {step: 2, height: 420})
}

nextTick(() => resetGame())

function startGame() {
  isFirstStart.value = false;
  marblesGame?.start()
}

function restartGame() {
  marblesGame?.restart()
}
</script>

<template>
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
  height: 600px;
}
</style>
