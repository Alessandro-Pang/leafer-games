<script setup lang="ts">
import {routes} from "../../router";

const routesList = routes.filter(item => !item.meta.hidden)
</script>

<template>
<ul>
  <li v-for="(item, idx) of routesList" :key="idx">
    <router-link :to="item.path">{{item.meta.title}}</router-link>
  </li>
</ul>
</template>

<style scoped>
ul {
  list-style: none;
  display: flex;
}

li {
  margin: 10px;
  height: 200px;
  width: 300px;
  text-align: center;
  line-height: 200px;
  border: 1px solid red;
}
</style>
