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
})

export default router