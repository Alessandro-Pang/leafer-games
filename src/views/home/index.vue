<!--
 * @Author: zi.yang
 * @Date: 2024-07-06 14:16:02
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-06-04 00:16:37
 * @Description: 首页
 * @FilePath: /leafer-games/src/views/home/index.vue
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { routes } from '@/router'; // eslint-disable-line

// 过滤出要显示的路由
const routesList = routes.filter((item: any) => !item.meta.hidden);

// 搜索功能
const searchQuery = ref('');
const filteredRoutes = computed(() => {
  if (!searchQuery.value) return routesList;
  const query = searchQuery.value.toLowerCase();
  return routesList.filter(
    (route: any) => route.meta.title.toLowerCase().includes(query)
      || (route.meta.description
        && route.meta.description.toLowerCase().includes(query)),
  );
});

// 随机标签
const tags = ['热门', '推荐', '新游戏', '经典', '挑战'];
// 使用索引确保每次渲染相同游戏显示相同标签
const getRandomTag = (index: number) => tags[index % tags.length];

// 动画效果
const isLoaded = ref(false);
onMounted(() => {
  // 页面加载完成后设置标志
  setTimeout(() => {
    isLoaded.value = true;
  }, 500);
});

// 鼠标悬停效果
const activeCard = ref(-1);
const setActiveCard = (index: number) => {
  activeCard.value = index;
};
const resetActiveCard = () => {
  activeCard.value = -1;
};
</script>

<template>
  <div class="home-container">
    <h1 class="page-title">
      选择你喜欢的游戏
    </h1>
    <p class="page-subtitle">探索多种有趣的小游戏，放松身心，享受乐趣</p>

    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索游戏..."
      />
      <div class="search-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>

    <div v-if="filteredRoutes.length === 0" class="no-results">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="15" x2="16" y2="15"></line>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
      <p>没有找到匹配的游戏</p>
      <button class="reset-search" @click="searchQuery = ''">重置搜索</button>
    </div>

    <ul class="card-list" :class="{ 'is-loaded': isLoaded }">
      <li
        v-for="(route, idx) in filteredRoutes"
        :key="route.path"
        class="card-item--box"
        :style="{ '--i': idx }"
        :class="{ 'is-active': activeCard === idx }"
        @mouseenter="setActiveCard(idx)"
        @mouseleave="resetActiveCard()"
      >
        <div class="card-item">
          <router-link :to="route.path">
            <div class="card-content">
              <div class="card-icon">
                <img :src="route.meta.icon" :alt="route.meta.title" />
              </div>
              <div class="card-info">
                <span class="link-name">
                  {{ route.meta.title }}
                </span>
                <p class="card-description">{{ route.meta.description }}</p>
                <div class="play-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  开始游戏
                </div>
              </div>
              <div class="card-tags">
                <span class="tag">
                  {{ getRandomTag(idx) }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home-container {
  position: relative;
  min-height: 100%;
  padding: 20px 0 60px;
  overflow: hidden;
  background-color: #e9ecef;
  background-image: url('@/assets/bg.svg');
  background-repeat: repeat;
  background-size: auto;
}

.page-title {
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin: 20px 0;
  font-weight: 700;
  letter-spacing: 2px;
  animation: fadeIn 1s forwards 0.2s;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  background: linear-gradient(to right, #0052d4, #65c7f7, #0052d4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% auto;
  animation: gradientText 5s infinite alternate;
}

.page-subtitle {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  margin: 0 0 30px;
  opacity: 0;
  animation: fadeIn 1s forwards 0.4s;
}

.page-title::after {
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

.search-box {
  max-width: 500px;
  margin: 0 auto 40px;
  position: relative;
  opacity: 0;
  animation: fadeIn 1s forwards 0.6s;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  border-radius: 30px;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-icon:hover {
  color: #0052d4;
  transform: translateY(-50%) scale(1.1);
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  margin: 20px auto;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s forwards;
}

.no-results svg {
  margin-bottom: 15px;
  color: #0052d4;
  opacity: 0.7;
}

.no-results p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.reset-search {
  background: linear-gradient(to right, #0052d4, #65c7f7);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 82, 212, 0.3);
}

.reset-search:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 82, 212, 0.4);
}

.card-list {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 20px;
  flex-wrap: wrap;
  justify-content: center;
  perspective: 1000px;
  /* 3D效果的视角 */
  position: relative;
  z-index: 1;
  min-height: 300px;
}

.card-list.is-loaded {
  opacity: 1;
}

/* 卡片列表样式 */
.card-list {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.card-list.is-loaded {
  opacity: 1;
}

.card-item--box {
  position: relative;
  margin: 15px;
  padding: 2px;
  height: 250px;
  width: 350px;
  text-align: left;
  border-radius: 16px;
  font-size: 18px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12), 0 5px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
  transform: translateY(30px) rotate(2deg);
  animation: fadeInUp 0.8s forwards;
  animation-delay: calc(0.15s * var(--i, 0));
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.8)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.card-item--box:hover,
.card-item--box.is-active {
  transform: translateY(-10px) scale(1.03) rotate(0deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 15px 20px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.card-item--box.is-active::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 20px;
  background: linear-gradient(45deg, #0052d4, #65c7f7, #4ecdc4, #0052d4);
  background-size: 400% 400%;
  z-index: -1;
  filter: blur(8px);
  animation: gradientBorder 3s ease infinite;
  opacity: 0.7;
}

.card-item {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff, #f0f2f5);
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.card-item:hover {
  background: linear-gradient(135deg, #f0f2f5, #ffffff);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  position: relative;
  z-index: 2;
}

.card-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.card-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.card-item:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.card-info {
  flex: 1;
}

.link-name {
  color: #333;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 10px;
  display: block;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.card-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  opacity: 0.9;
  transition: all 0.3s ease;
}

.card-item:hover .card-description {
  opacity: 1;
}

.play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #0052d4, #65c7f7);
  color: white;
  padding: 8px 20px;
  border-radius: 30px;
  margin-top: 15px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 82, 212, 0.3);
  width: fit-content;
  opacity: 0.9;
}

.play-button svg {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.card-item:hover .play-button {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 82, 212, 0.4);
  opacity: 1;
}

.card-tags {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 3;
}

.tag {
  background: linear-gradient(to right, #ff6b6b, #ff9f1c);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(255, 107, 107, 0.3);
  animation: pulse 2s infinite;
}

.card-item:deep(a) {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  position: relative;
  z-index: 1;
}

@keyframes move-border {
  0% {
    top: 0;
    left: 0;
  }

  25% {
    top: 0;
    left: 98%;
  }

  50% {
    top: 98%;
    left: 98%;
  }

  75% {
    top: 98%;
    left: 0;
  }

  100% {
    top: 0;
    left: 0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) rotate(2deg);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes shine {
  to {
    background-position: -100% 0;
  }
}

@keyframes floatAnimation {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(30px, 30px);
  }
}

@keyframes pulseAnimation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.15;
  }

  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.2;
  }

  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.15;
  }
}

@keyframes gradientText {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 100% 50%;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes gradientBorder {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-10px);
  }

  60% {
    transform: translateY(-5px);
  }
}

@media (max-width: 768px) {
  .card-item--box {
    width: 100%;
    max-width: 400px;
  }

  .page-title {
    font-size: 2.2rem;
    margin: 15px 0 10px;
  }

  .page-subtitle {
    font-size: 1rem;
    margin-bottom: 20px;
  }

  .search-box {
    max-width: 90%;
    margin-bottom: 30px;
  }

  .game-stats {
    flex-direction: column;
    align-items: center;
  }

  .stat-item {
    margin: 10px 0;
    min-width: 200px;
  }
}

@media (max-width: 480px) {
  .card-item--box {
    height: auto;
    min-height: 220px;
  }

  .card-icon {
    width: 50px;
    height: 50px;
  }

  .link-name {
    font-size: 1.3rem;
  }

  .card-description {
    font-size: 0.8rem;
  }
}
</style>
