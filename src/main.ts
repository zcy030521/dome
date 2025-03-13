import { createApp } from 'vue'
import './style.css'
import router from './router/index.ts'
import 'vant/lib/index.css';
import "@nutui/nutui/dist/style.css";
import { Tabbar, TabbarItem, } from 'vant';
import App from './App.vue'
import { Swiper, SwiperItem } from '@nutui/nutui'
createApp(App).use(router).use(Swiper).use(SwiperItem).use(Tabbar).use(TabbarItem).mount('#app')