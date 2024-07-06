<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute()
const name = computed(() => route.meta.title)
</script>

<template>
  <header>
    Leafer 小游戏中心 - {{ name }}
  </header>
  <router-view/>
</template>

<style scoped>
header {
  height: 60px;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  background: aquamarine;
  line-height: 60px;
}
</style>
