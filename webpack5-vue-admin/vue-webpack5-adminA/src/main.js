import { createApp } from 'vue' // Vue 3.x 引入 vue 的形式
import Vue from 'vue'
import App from './app.vue' // 引入 APP 页面组建
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
const app = createApp(App) // 通过 createApp 初始化 app
app.mount('#root') // 将页面挂载到 root 节点