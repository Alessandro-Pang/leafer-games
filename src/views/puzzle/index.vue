<!--
 * @Author: zi.yang
 * @Date: 2024-07-06 14:16:02
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-06-04 01:28:16
 * @Description: 拼图
 * @FilePath: /leafer-games/src/views/puzzle/index.vue
-->
<script setup lang="ts">
import { nextTick, ref } from 'vue';

import {
  Button as AButton,
  Col as ACol,
  message,
  Modal,
  Row as ARow,
  Select as ASelect,
  SelectOption as ASelectOption,
  Spin as ASpin,
} from 'ant-design-vue';

import type { PlatformSizeConfig } from '@/game-core/GameGraph';
import { UndoOutlined } from '@ant-design/icons-vue';

import PuzzleGame from '.';

// 游戏标题
const gameTitle = '拼图游戏';

// 游戏操作说明
const gameInstructions = [
  '游戏目标：将打乱的图片拼回正确的位置，还原完整图像。',
  '操作方法：拖拽相邻的两个方块，它们会交换位置。',
  '游戏规则：当所有方块都在正确位置时，游戏胜利。',
  '难度设置：可以通过选择不同的难度级别（3x3到9x9）来调整游戏难度。',
  '提示：可以查看缩略图作为参考，帮助你还原图像。',
];

const count = ref(4);
const img = ref('');
const loading = ref(false);
const showInstructions = ref(false);

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
  puzzleGame = new PuzzleGame('game-wrapper', {
    count: count.value,
    url: '',
    size,
  });
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
  <div class="puzzle-game-container">
    <h1 class="game-title">
      {{ gameTitle }}
    </h1>

    <div v-if="loading" class="loading">
      <a-spin size="large" tip="正在加载游戏，请稍候..." />
    </div>

    <a-row class="main">
      <a-col :lg="8" :md="24">
        <h3>缩略图</h3>
        <div style="height: 200px; width: 200px; display: inline-block">
          <img v-if="img" :src="img" style="height: 200px" alt="缩略图" />
        </div>
      </a-col>
      <a-col :lg="16" :md="24" style="margin-top: 20px; width: 100%">
        <div id="game-wrapper" style="width: 100%; height: 500px"></div>
      </a-col>
    </a-row>

    <div class="game-controls">
      <div class="difficulty-selector">
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
      </div>

      <div class="action-buttons">
        <a-button type="primary" style="margin-right: 20px" @click="resetGame">
          <UndoOutlined />重置拼图
        </a-button>
        <a-button
          type="primary"
          style="margin-right: 20px"
          @click="shuffleImages"
        >
          <UndoOutlined />打乱拼图
        </a-button>
        <a-button type="default" @click="showInstructions = true">
          游戏说明
        </a-button>
      </div>
    </div>

    <!-- 游戏说明弹窗 -->
    <Modal
      v-model:visible="showInstructions"
      :title="`${gameTitle} - 游戏说明`"
      :footer="null"
      width="500px"
    >
      <div class="instructions-content">
        <ul>
          <li v-for="(instruction, index) in gameInstructions" :key="index">
            {{ instruction }}
          </li>
        </ul>
      </div>
      <div class="modal-footer">
        <a-button type="primary" @click="showInstructions = false">
          我知道了
        </a-button>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.puzzle-game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.game-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
}

.main {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.game-controls {
  text-align: center;
  margin: 20px 0;
}

.difficulty-selector {
  margin-bottom: 15px;
}

.action-buttons {
  margin-top: 10px;
}

.instructions-content {
  padding: 10px 0;
}

.instructions-content ul {
  padding-left: 20px;
}

.instructions-content li {
  margin-bottom: 10px;
  line-height: 1.5;
}

.modal-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
