import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { URL } from 'node:url';

const dirname = new URL('.', import.meta.url).pathname;
const resolve = (dir: string): string => path.resolve(dirname, dir);

// https://vitejs.dev/config/
export default defineConfig((conf) => {
  const isProd = conf.mode === 'production';
  return {
    plugins: [vue()],
    base: isProd ? '/leafer-games/' : '/',
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
  };
});
