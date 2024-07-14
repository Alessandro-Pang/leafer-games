<!--
 * @Author: zi.yang
 * @Date: 2024-07-06 14:16:02
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-07-06 14:41:56
 * @Description: 拼图
 * @FilePath: /leafer-games/src/views/puzzle/index.vue
-->
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import {
  Button as AButton,
  message,
  Spin as ASpin,
  Col as ACol,
  Row as ARow,
  Select as ASelect,
  SelectOption as ASelectOption,
} from 'ant-design-vue';
import { UndoOutlined } from '@ant-design/icons-vue';
import PuzzleGame from '.';
import type { PlatformSizeConfig } from '@/game-core/GameGraph';

const count = ref(4);
const img = ref('');
const loading = ref(false);

let puzzleGame: PuzzleGame | null = null;

function fetchImage(boxSize: number): Promise<string> {
  if (!boxSize) {
    throw new Error('boxSize 不能为空');
  }
  loading.value = true;
  return new Promise((resolve) => {
    fetch(`https://picsum.photos/${boxSize}/${boxSize}`)
      .then((res) => res.blob())
      .then((data) => {
        img.value = window.URL.createObjectURL(new Blob([data]));
        resolve(img.value);
      })
      .catch(() => {
        message.error('图片加载失败，请刷新后重试');
      })
      .finally(() => {
        loading.value = false;
      });
  });
}

const size: PlatformSizeConfig = {
  mobile: [window.innerWidth, window.innerWidth],
};

function initGame() {
  puzzleGame = new PuzzleGame('game-wrapper', { count: count.value, url: '', size });
  // 通过内部实现获取 boxSize
  fetchImage(puzzleGame.wrapper.width!).then((url) => {
    puzzleGame?.resetGame({ count: count.value, url, size });
  });
}

function changeDifficulty() {
  puzzleGame?.resetGame({ count: count.value, url: img.value, size });
}

function resetGame() {
  fetchImage(puzzleGame?.wrapper.width!).then(() => {
    puzzleGame?.resetGame({ count: count.value, url: img.value, size });
  });
}

function shuffleImages() {
  puzzleGame?.shuffleImages();
}

nextTick(() => initGame());
</script>

<template>
  <div v-if="loading" class="loading">
    <a-spin size="large" tip="正在加载游戏，请稍候..." />
  </div>
  <a-row class="main">
    <a-col :lg="8" :md="24">
      <h3>缩略图</h3>
      <div style="height: 200px; width: 200px; display: inline-block">
        <img v-if="img" :src="img" style="height: 200px" alt="缩略图">
      </div>
    </a-col>
    <a-col :lg="16" :md="24" style="margin-top: 20px; width: 100%">
      <div id="game-wrapper" style="width: 100%; height: 500px"></div>
    </a-col>
  </a-row>
  <div style="text-align: center; margin: 20px 0">
    对局难度：
    <a-select
      v-model:value="count"
      style="width: 160px; margin-bottom: 10px"
      @change="changeDifficulty"
    >
      <a-select-option v-for="idx of 6" :key="idx" :value="idx + 3">
        {{ `${idx + 3} x ${idx + 3}` }}
      </a-select-option>
    </a-select>
    <br>
    <a-button type="primary" style="margin-right: 20px;" @click="resetGame">
      <UndoOutlined />重置拼图
    </a-button><a-button type="primary" @click="shuffleImages">
      <UndoOutlined />打乱拼图
    </a-button>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 100%;
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
