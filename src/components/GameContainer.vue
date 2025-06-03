<!--
 * @Author: zi.yang
 * @Date: 2025-06-04 00:21:38
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-06-04 01:16:39
 * @Description: 统一的游戏界面容器组件
 * @FilePath: /leafer-games/src/components/GameContainer.vue
-->

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { Button as AButton, Modal } from 'ant-design-vue';

interface Props {
  title: string;
  instructions: string[];
  score?: number;
  isFirstStart?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  score: 0,
  isFirstStart: true,
});

const emit = defineEmits(['start', 'restart']);

// 控制游戏说明弹窗的显示
const instructionsVisible = ref(false);

// 显示游戏说明
function showInstructions() {
  instructionsVisible.value = true;
}

// 开始游戏
function startGame() {
  emit('start');
}

// 重新开始游戏
function restartGame() {
  emit('restart');
}

// 阻止方向键和WASD键的默认行为，防止页面滚动
function handleKeyDown(event: KeyboardEvent) {
  // 方向键和WASD键的键码
  const keyCodes = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight', // 方向键
    'KeyW',
    'KeyA',
    'KeyS',
    'KeyD', // WASD键
    'Space', // 空格键
  ];

  if (keyCodes.includes(event.code)) {
    event.preventDefault(); // 阻止默认行为
  }
}

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
};

// 粒子效果
const particles = ref<Array<Particle>>([]);
const particleCount = 50; // 粒子数量

// 创建粒子
function createParticles() {
  const colors = [
    '#0052d4',
    '#4364f7',
    '#6fb1fc',
    '#f7971e',
    '#ffd200',
    '#11998e',
  ];

  for (let i = 0; i < particleCount; i++) {
    particles.value.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      speed: Math.random() * 1 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

// 自动在第一次加载时显示游戏说明
onMounted(() => {
  if (props.isFirstStart) {
    instructionsVisible.value = true;
  }

  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyDown);

  // 创建粒子
  createParticles();
});

// 组件卸载时清理
onUnmounted(() => {
  instructionsVisible.value = false;

  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="game-container">
    <!-- 粒子背景 -->
    <div class="particles-container">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="particle"
        :style="{
          left: particle.x + 'px',
          top: particle.y + 'px',
          width: particle.size + 'px',
          height: particle.size + 'px',
          backgroundColor: particle.color,
          animationDuration: 5 / particle.speed + 's',
        }"
      ></div>
    </div>

    <!-- 游戏标题 -->
    <h1 class="game-title" :class="{ 'animate-title': true }">
      {{ title }}
    </h1>

    <!-- 分数板 -->
    <div class="score-board">
      <div class="board">
        <span>分数：</span>
        <span class="score">
          {{ score }}
        </span>
      </div>
    </div>

    <!-- 游戏主体区域 -->
    <div class="main">
      <div id="game-wrapper" style="width: 100%; height: 100%"></div>
    </div>

    <!-- 游戏控制按钮 -->
    <div class="game-controls">
      <a-button
        v-if="isFirstStart"
        type="primary"
        class="start-btn"
        @click="startGame"
      >
        <span class="btn-icon"> ▶ </span>
        开始游戏
      </a-button>
      <a-button v-else type="primary" class="restart-btn" @click="restartGame">
        <span class="btn-icon"> ↻ </span>
        重新开始
      </a-button>
      <a-button
        type="default"
        class="instructions-btn"
        @click="showInstructions"
      >
        <span class="btn-icon"> ℹ </span>
        游戏说明
      </a-button>
    </div>

    <!-- 游戏说明弹窗 -->
    <Modal
      v-model:visible="instructionsVisible"
      :title="`${title} - 游戏说明`"
      :footer="null"
      width="500px"
      class="instructions-modal"
    >
      <div class="instructions-content">
        <ul>
          <li
            v-for="(instruction, index) in instructions"
            :key="index"
            :style="{ animationDelay: `${index * 0.1}s` }"
            class="instruction-item"
          >
            {{ instruction }}
          </li>
        </ul>
      </div>
      <div class="modal-footer">
        <a-button type="primary" @click="instructionsVisible = false">
          我知道了
        </a-button>
      </div>
    </Modal>

    <!-- 装饰元素 -->
    <div class="decoration-circle circle-1"></div>
    <div class="decoration-circle circle-2"></div>
    <div class="decoration-circle circle-3"></div>

    <!-- 插槽：可以添加额外的游戏特定内容 -->
    <slot></slot>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background-color: #e9ecef;
  background-image: url('@/assets/bg.svg'),
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  background-repeat: repeat, no-repeat;
  background-size: auto, cover;
  background-position: center, center;
  position: relative;
  overflow: hidden;
}

.game-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(
    135deg,
    rgba(0, 82, 212, 0.15),
    rgba(101, 199, 247, 0.15),
    rgba(0, 82, 212, 0.15)
  );
  z-index: -1;
  animation: gradientShift 15s ease infinite;
}

/* 粒子容器 */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 粒子样式 */
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: float 5s ease-in-out infinite;
  pointer-events: none;
}

.game-title {
  text-align: center;
  font-size: 2.5rem;
  margin: 20px 0 30px;
  font-weight: 800;
  letter-spacing: 3px;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.15);
  position: relative;
  background: linear-gradient(to right, #0052d4, #65c7f7, #4364f7, #0052d4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% auto;
  animation: gradientText 5s infinite alternate;
}

.game-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(to right, #65c7f7, #0052d4);
  border-radius: 3px;
}

.main {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  height: 500px;
  margin-bottom: 30px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.main:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18), 0 8px 20px rgba(0, 0, 0, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.score-board {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  perspective: 1000px;
}

.score-board > .board {
  height: 70px;
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0052d4, #4364f7, #6fb1fc);
  color: white;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  padding: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.score-board > .board::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  animation: btnShine 4s infinite linear;
  pointer-events: none;
}

.score-board > .board:hover {
  transform: translateY(-5px) rotateX(10deg);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2), 0 8px 15px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.score-board > .board > .score {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-top: 5px;
}

.score-board > .board > span:first-child {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.game-controls {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.game-controls button {
  margin: 0 12px;
  min-width: 140px;
  height: 45px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08), 0 3px 8px rgba(0, 0, 0, 0.05);
  border: none;
}

.game-controls button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.game-controls button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08);
}

.game-controls button:hover::before {
  animation: btnShine 1.5s infinite linear;
  opacity: 1;
}

.game-controls button[type='primary'] {
  background: linear-gradient(135deg, #0052d4, #4364f7, #6fb1fc);
  color: white;
  box-shadow: 0 8px 20px rgba(0, 82, 212, 0.25),
    0 4px 10px rgba(0, 82, 212, 0.15);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.game-controls button[type='primary']:hover {
  background: linear-gradient(135deg, #0046b8, #3a58e7, #5a9df9);
  box-shadow: 0 10px 25px rgba(0, 82, 212, 0.35),
    0 6px 12px rgba(0, 82, 212, 0.2);
}

.instructions-btn {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #333;
}

.instructions-btn:hover {
  background: #f8f9fa;
  color: #0052d4;
}

.instructions-content {
  padding: 15px;
  max-height: 350px;
  overflow-y: auto;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.instructions-content ul {
  padding-left: 0;
}

.instructions-content li {
  margin-bottom: 12px;
  line-height: 1.6;
}

.modal-footer {
  text-align: center;
  margin-top: 20px;
}

/* 按钮样式 */
.btn-icon {
  margin-right: 5px;
  font-size: 16px;
}

.start-btn,
.restart-btn {
  position: relative;
  overflow: hidden;
}

.start-btn::after,
.restart-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: rotate(45deg);
  transition: all 0.3s ease;
  opacity: 0;
}

.start-btn:hover::after,
.restart-btn:hover::after {
  opacity: 1;
  animation: btnShine 1s forwards;
}

/* 指令项动画 */
.instruction-item {
  animation: fadeInRight 0.5s ease forwards;
  opacity: 0;
}

/* 装饰元素 */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(0, 82, 212, 0.08),
    rgba(101, 199, 247, 0.08)
  );
  z-index: -1;
  animation: float 10s ease-in-out infinite;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.2);
}

.circle-1 {
  width: 350px;
  height: 350px;
  top: -150px;
  left: -100px;
  animation-delay: 0s;
  opacity: 0.7;
}

.circle-2 {
  width: 250px;
  height: 250px;
  bottom: 50px;
  right: -80px;
  animation-delay: 2s;
  opacity: 0.6;
  background: linear-gradient(
    135deg,
    rgba(247, 151, 30, 0.08),
    rgba(255, 210, 0, 0.08)
  );
}

.circle-3 {
  width: 180px;
  height: 180px;
  bottom: -70px;
  left: 30%;
  animation-delay: 1s;
  opacity: 0.5;
  background: linear-gradient(
    135deg,
    rgba(17, 153, 142, 0.08),
    rgba(56, 239, 125, 0.08)
  );
}

/* 浮动元素 */
.floating-element {
  position: absolute;
  font-size: 2rem;
  z-index: -1;
  animation: float 8s ease-in-out infinite;
  opacity: 0.5;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.1));
  pointer-events: none;
}

.float-1 {
  top: 15%;
  right: 10%;
  animation-delay: 0s;
}

.float-2 {
  bottom: 20%;
  left: 8%;
  animation-delay: 2s;
}

.float-3 {
  top: 40%;
  right: 15%;
  animation-delay: 4s;
}

/* 装饰形状 */
.decorative-shape {
  position: absolute;
  z-index: -1;
  opacity: 0.4;
  pointer-events: none;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 25%;
  left: 5%;
  background: linear-gradient(135deg, #0052d4, #4364f7);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation: rotate 15s linear infinite;
}

.shape-2 {
  width: 60px;
  height: 60px;
  bottom: 15%;
  right: 8%;
  background: linear-gradient(135deg, #f7971e, #ffd200);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  animation: rotate 20s linear infinite reverse;
}

.shape-3 {
  width: 40px;
  height: 40px;
  top: 60%;
  left: 8%;
  background: linear-gradient(135deg, #11998e, #38ef7d);
  clip-path: circle(50% at 50% 50%);
  animation: pulse 5s ease-in-out infinite;
}

/* 脉冲效果 */
.pulse {
  animation: pulse 2s infinite;
}

/* 标题动画 */
.animate-title {
  animation: fadeIn 1s forwards, gradientText 5s infinite alternate;
}

/* 动画效果 */
@keyframes gradientText {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes shine {
  0% {
    left: -100%;
    top: -100%;
  }
  100% {
    left: 100%;
    top: 100%;
  }
}

@keyframes btnShine {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(2deg);
  }
  50% {
    transform: translateY(-20px) rotate(0deg);
  }
  75% {
    transform: translateY(-10px) rotate(-2deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
/* 按钮图标 */
.btn-icon {
  margin-right: 8px;
  font-size: 1.1rem;
}

/* 指令项样式 */
.instruction-item {
  display: flex;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(0, 82, 212, 0.05);
  border-radius: 8px;
  animation: fadeInRight 0.5s ease forwards;
  opacity: 0;
  transform: translateX(20px);
  border-left: 3px solid #0052d4;
}

.instruction-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  background: #0052d4;
  color: white;
  border-radius: 50%;
  margin-right: 10px;
  font-weight: bold;
  flex-shrink: 0;
}

.instruction-text {
  flex: 1;
}

/* 指令头部 */
.instructions-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.instructions-icon {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #0052d4, #4364f7);
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
}

.instructions-icon::before {
  content: 'i';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-style: italic;
}

/* 媒体查询 - 响应式设计 */
@media (max-width: 768px) {
  .game-title {
    font-size: 2rem;
  }

  .main {
    width: 95%;
  }

  .game-controls {
    flex-direction: column;
    gap: 15px;
  }

  .game-controls button {
    width: 100%;
    margin: 0;
  }

  .score-board > .board {
    width: 150px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-title {
    font-size: 1.8rem;
  }

  .main {
    height: 400px;
  }

  .score-board > .board {
    height: 60px;
    width: 130px;
    line-height: 60px;
  }

  .score-board > .board > .score {
    font-size: 24px;
  }
}
</style>
