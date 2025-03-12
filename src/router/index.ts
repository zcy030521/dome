import { createRouter,createWebHashHistory } from "vue-router";

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            name:'登录',
            component:()=>import('../views/Login.vue')
        },
        //重定向手动输入/Login跳转登录页面
        {
            path:'/login',
            redirect:'/'
        },
        {
            path:'/index',
            name:'首页',
            component:()=>import('../views/Index.vue')
        },
        {
            path:'/register',
            name:'注册',
            component:()=>import('../views/Register.vue')
        },
    ]
})

export default router