/*
 * @Author: ChatGIS
 * @Description: 配置信息
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import {resolve} from 'path'
import eslintPlugin from 'vite-plugin-eslint'

const pjoneServer = 'http://127.0.0.1:1304/'
const geoserver = 'http://127.0.0.1:1302/'
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
    port: 1303,
    proxy: {
      '/pjone-server': {
        target: pjoneServer,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/pjone-server/, '')
      },
      '/geoserver': {
        target: geoserver,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/pjone-server/, '')
      },
      '/gaodetile': { // 请求路径关键字
        target: 'http://webst01.is.autonavi.com/', // 对应自己的接口
        changeOrigin: true, // 是否允许跨域,在本地会创建一个虚拟服务端，然后发送请求的数据，
        rewrite: (path) => path.replace(/^\/gaodetile/, '')
      },
      '/baiduapi': { // 请求路径关键字
        target: 'https://api.map.baidu.com/', // 对应自己的接口
        changeOrigin: true, // 是否允许跨域,在本地会创建一个虚拟服务端，然后发送请求的数据，
        rewrite: (path) => path.replace(/^\/baiduapi/, '')
      }
    }
  }
})
