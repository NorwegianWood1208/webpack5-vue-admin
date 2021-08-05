import { createApp } from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI, { locale })
const app = createApp(App)
app.mount('#root')

