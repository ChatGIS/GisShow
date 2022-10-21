import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import {resolve} from 'path'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/gisshow/',
  plugins: [vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
  }),
    Components({
      resolvers: [ElementPlusResolver()],
  }),
  eslintPlugin({
    include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts', 'src/*.js', 'src/*.vue', 'src/*.ts']
  })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),  // 路径别名
    }
  },
  server: {
    proxy: {
      '/gaodetile': { // 请求路径关键字
        target: 'http://webst01.is.autonavi.com/', // 对应自己的接口
        changeOrigin: true, // 是否允许跨域,在本地会创建一个虚拟服务端，然后发送请求的数据，
        rewrite: (path) => path.replace(/^\/gaodetile/, '')
      }
    }
  }
})
