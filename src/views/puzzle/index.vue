<script setup lang="ts">
import {createGraph} from "../../utils/app.ts";
import {nextTick, ref} from "vue";
import {init, shuffleImages} from "./index.ts";
import {App, Box} from "leafer-ui";
import {Button as AButton, message, Spin as ASpin} from "ant-design-vue";
import {UndoOutlined} from '@ant-design/icons-vue'

let wrapper: Box | null = null
let app: App | null = null

const count = ref(4);
const img = ref('')
const loading = ref(false);

function initGame() {
  if (app === null) return

  const option = {
    count: count.value,
    width: 500,
    height: 500
  }

  loading.value = true
  fetch(`https://picsum.photos/${option.width}/${option.height}`)
      .then(res => res.blob())
      .then((data) => {
        loading.value = false
        img.value = window.URL.createObjectURL(new Blob([data]));
        const context = init(app!, {...option, url: img.value});
        wrapper = context.wrapper;
      })
      .catch((err) => {
        message.error(`图片加载失败，请刷新后重试`)
        console.error(err)
      })
      .finally(() => {
        loading.value = false
      })
}

nextTick(() => {
  app = createGraph('game')
  app.height = 600
  app.width = 600
  initGame()
})
</script>

<template>
  <div class="loading" v-if="loading">
    <a-spin size="large" tip="正在加载游戏，请稍候..."/>
  </div>
  <div class="main">
    <div>
      <h3>缩略图</h3>
      <img :src="img" style="height: 300px" alt="缩略图">
    </div>
    <div id="game"></div>
  </div>
  <div style="text-align: center">
    <a-button type="primary" @click="initGame" style="margin-right: 20px;">
      <UndoOutlined/>
      重置拼图
    </a-button>
    <a-button type="primary" @click="() => shuffleImages(wrapper!)">
      <UndoOutlined/>
      打乱拼图
    </a-button>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  height: 600px;
  width: 100%;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255,0.4);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

#game {
  height: 600px;
  width: 600px;
}
</style>
