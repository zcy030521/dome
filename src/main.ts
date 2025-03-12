import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
//导入路由
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(ElementPlus).use(router).mount('#app')
