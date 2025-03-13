<<<<<<< HEAD
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
=======
import { createRouter, createWebHistory } from 'vue-router'

const routes:any = [
    {
        path: '/',
        name: 'Home',
        component: ()=>import('../view/home.vue'),
        children:[
            {
                path:"cate",
                name:"Cate",
                component:()=>import('../view/cate.vue')
            },{
                path:"car",
                name:"Car",
                component:()=>import('../view/car.vue')
            },{
                path:"my",
                name:"My",
                component:()=>import('../view/my.vue')
            }
        ]
    },

   
]

const router = createRouter({
    history: createWebHistory(),
    routes,
>>>>>>> 0210a3b8718037a3ded9f5ee1e019da2ce099205
})

export default router