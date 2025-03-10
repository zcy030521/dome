import { createApp } from 'vue'
import './style.css'
import router from './router/index.ts'
import 'vant/lib/index.css';
import { Tabbar, TabbarItem } from 'vant';
import App from './App.vue'



createApp(App).use(router).use(Tabbar).use(TabbarItem).mount('#app')
