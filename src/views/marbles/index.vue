<script setup lang="ts">
import {nextTick, ref} from "vue";
import MarblesGame from "./index.ts";
import {
  Spin as ASpin,
  Button as AButton,
} from "ant-design-vue";

let marblesGame: MarblesGame | null = null

const loading = ref(false);

function resetGame() {
  marblesGame = new MarblesGame('game-wrapper', { step: 2, height: 420})
}

nextTick(() => resetGame())

function restartGame() {
  marblesGame?.restart()
}
</script>

<template>
  <div class="loading" v-if="loading">
    <a-spin size="large" tip="正在加载游戏，请稍候..."/>
  </div>
  <div class="main">
    <div id="game-wrapper" style="width: 100%; height: 100%"></div>
  </div>
  <div style="text-align: center; margin: 20px 0">
    <a-button type="primary" @click="restartGame">重新开始</a-button>
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

.loading {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.4);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
