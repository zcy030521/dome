import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { ethers } from 'ethers'
import axios from 'axios'

// 配置 axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
axios.defaults.timeout = 10000
axios.defaults.headers.common['Content-Type'] = 'application/json'

const app = createApp(App)
app.use(router)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err)
  console.error('错误信息:', info)
}

app.mount('#app')
