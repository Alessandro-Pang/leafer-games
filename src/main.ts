/*
 * @Author: zi.yang
 * @Date: 2024-07-06 11:34:17
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-07-06 14:42:17
 * @Description:
 * @FilePath: /leafer-games/src/main.ts
 */
import 'normalize.css';
import './style.css';
import 'ant-design-vue/dist/reset.css';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.mount('#app');
