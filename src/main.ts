<<<<<<< HEAD
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
//导入路由
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(ElementPlus).use(router).mount('#app')
=======
import { createApp } from 'vue'
import './style.css'
import router from './router/index.ts'
import 'vant/lib/index.css';
import "@nutui/nutui/dist/style.css";
import { Tabbar, TabbarItem, } from 'vant';
import App from './App.vue'
import { Swiper, SwiperItem } from '@nutui/nutui'
createApp(App).use(router).use(Swiper).use(SwiperItem).use(Tabbar).use(TabbarItem).mount('#app')
>>>>>>> 0210a3b8718037a3ded9f5ee1e019da2ce099205
