<script setup lang="ts">
import {routes} from "../../router";

const routesList = routes.filter(item => !item.meta.hidden)
</script>

<template>
  <ul class="card-list">
    <li  class="card-item--box" v-for="(item, idx) of routesList" :key="idx">
      <div class="card-item">
        <router-link :to="item.path">
          <div class="link-name">{{ item.meta.title }}</div>
        </router-link>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.card-list {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.card-item--box {
  position: relative;
  margin: 10px;
  padding: 2px;
  height: 200px;
  width: 300px;
  text-align: center;
  border-radius: 8px;
  font-size: 22px;
  letter-spacing: 10px;
  overflow: hidden;
}

.card-item {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(to right, #C6FFDD, #FBD786, #f7797d);
}

.card-item::before {
  content: "";
  position: absolute;
  display: inline-block;
  width: 40px;
  height: 40px;
  background-image: linear-gradient(to bottom, #FDC830, #F37335);
  left: 0;
  top: -2px;
  z-index: -1;
  animation: move-border 4s infinite;
  border-radius: 2px
}

.link-name {
  color: #fff;
  font-weight: 400;
  display: inline-block;
}

.card-item:deep(a) {
  display: flex;
  width: 100%;
  height: 100%;
  text-decoration: none;
  align-items: center;
  justify-content: center;
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

@media (max-width: 639px) {
 .card-item--box {
    width: 100%;
  }
}
</style>
