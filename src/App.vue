<!--
 * @Author: zi.yang
 * @Date: 2024-07-06 14:16:02
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-06-03 23:56:23
 * @Description: App
 * @FilePath: /leafer-games/src/App.vue
-->
<script setup lang="ts">
import { computed } from 'vue';

import { useRoute } from 'vue-router';

const route = useRoute();
const name = computed(() => route.meta.title);
</script>

<template>
  <header>
    <router-link to="/">
      <h3 style="display: inline-block">
        Leafer 小游戏中心 - {{ name }}
      </h3>
    </router-link>
  </header>
  <div class="view-box">
    <router-view />
  </div>
</template>

<style scoped>
header {
  height: 70px;
  font-weight: 600;
  text-align: center;
  background: linear-gradient(to right, #65c7f7, #0052d4, #65c7f7);
  line-height: 70px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: gradientAnimation 10s ease infinite;
  background-size: 200% 200%;
  z-index: 10;
}

header a {
  text-decoration: none;
  transition: all 0.3s ease;
}

header a:hover {
  transform: scale(1.05);
}

header h3 {
  color: #fff;
  margin: 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

header h3::after {
  content: '';
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #fff;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

header a:hover h3::after {
  width: 80%;
}

.view-box {
  height: calc(100% - 70px);
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  transition: all 0.5s ease;
}

@keyframes gradientAnimation {
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
</style>
