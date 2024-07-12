<!--
 * @Author: zi.yang
 * @Date: 2024-07-06 14:16:02
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-07-06 14:42:14
 * @Description: App
 * @FilePath: /leafer-games/src/App.vue
-->
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

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
  height: 60px;
  font-weight: 600;
  text-align: center;
  background: linear-gradient(to bottom, #65C7F7, #0052D4);
  line-height: 60px;
}

header h3 {
  color: #fff;
}

.view-box {
  height: calc(100% - 60px);
  overflow-y: auto;
}
</style>
