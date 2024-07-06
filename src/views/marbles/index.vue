<script setup lang="ts">
import {nextTick, ref} from "vue";
import MarblesGame from "./index.ts";
import {
  Button as AButton,
  message,
  Spin as ASpin,
  Col as ACol,
  Row as ARow,
  Select as ASelect,
  SelectOption as ASelectOption
} from "ant-design-vue";
import {UndoOutlined} from '@ant-design/icons-vue'

let marblesGame: MarblesGame | null = null

const loading = ref(false);

function resetGame() {
  marblesGame = new MarblesGame('game-wrapper')
}

nextTick(() => resetGame())
</script>

<template>
  <div class="loading" v-if="loading">
    <a-spin size="large" tip="正在加载游戏，请稍候..."/>
  </div>
  <div class="main">
    <div id="game-wrapper" style="width: 100%; height: 100%"></div>
  </div>
  <div style="text-align: center; margin: 20px 0">

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
