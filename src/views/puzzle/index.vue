<script setup lang="ts">
import {createGraph} from "../../utils/app.ts";
import {nextTick, ref} from "vue";
import {init, shuffleImages} from "./index.ts";
import {App, Box} from "leafer-ui";
import {
  Button as AButton,
  message,
  Spin as ASpin,
  Col as ACol,
  Row as ARow,
  Select as ASelect,
  SelectOption as ASelectOption
} from "ant-design-vue";
import {UndoOutlined} from '@ant-design/icons-vue'

let wrapper: Box | null = null
let app: App | null = null

const count = ref(4);
const img = ref('')
const loading = ref(false);

const boxSize = window.innerWidth > 600 ? 600 : window.innerWidth;

function initGame() {
  if (app === null) return
  const borderWidth = 20;
  const option = {
    count: count.value,
    width: boxSize - borderWidth,
    height: boxSize - borderWidth,
    borderWidth
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


function resetGame() {
  // 销毁画布
  app?.clear()
  // 如果不重新创建元素，会导致重置后报错
  const gameBox = document.createElement('div');
  gameBox.id = 'game'
  document.getElementById('game-wrapper')!.appendChild(gameBox)
  // 初始化游戏
  app = createGraph(gameBox)
  app.set({height: boxSize, width: boxSize})
  initGame()
}

nextTick(() => resetGame())
</script>

<template>
  <div class="loading" v-if="loading">
    <a-spin size="large" tip="正在加载游戏，请稍候..."/>
  </div>
  <a-row class="main">
    <a-col :lg="8" :md="24">
      <h3>缩略图</h3>
      <img :src="img" style="height: 200px" alt="缩略图">
    </a-col>
    <a-col :lg="16" :md="24" style="margin-top: 20px">
      <div id="game-wrapper" style="width: 100%; height: 100%"></div>
    </a-col>
  </a-row>
  <div style="text-align: center; margin: 20px 0">
    对局难度：
    <a-select v-model:value="count" style="width: 160px; margin-bottom: 10px" @change="resetGame">
      <a-select-option v-for="idx of 6" :value="idx + 3">{{ `${idx + 3} x ${idx + 3}` }}</a-select-option>
    </a-select>
    <br>
    <a-button type="primary" @click="resetGame" style="margin-right: 20px;">
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

#game {
  max-width: 600px;
  width: 100%
}
</style>
