import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

import Components from 'unplugin-vue-components/vite'

import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    server: {
      proxy: {
        '/api/qq_avatar': {
          target: 'https://q1.qlogo.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/qq_avatar/, '')
        },
        '/api/qq_group_avatar': {
          target: 'https://p.qlogo.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/qq_group_avatar/, '')
        }
      }
    },
    plugins: [
      vue(),
      UnoCSS(),
      Components({
        resolvers: [PrimeVueResolver()]
      })
    ]
  }
})
