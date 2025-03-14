import { createRouter, createWebHistory } from 'vue-router'
import OrderList from '../components/OrderList.vue'
import OrderDetail from '../components/OrderDetail.vue'
import OrderPayment from '../components/OrderPayment.vue'
import OrderEvaluation from '../components/OrderEvaluation.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/orders'
    },
    {
      path: '/orders',
      name: 'OrderList',
      component: OrderList,
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/order/:id/detail',
      name: 'OrderDetail',
      component: OrderDetail,
      props: true,
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/order/:id/payment',
      name: 'OrderPayment',
      component: OrderPayment,
      props: true,
      meta: {
        title: '订单支付'
      }
    },
    {
      path: '/order/:id/evaluate',
      name: 'OrderEvaluation',
      component: OrderEvaluation,
      props: true,
      meta: {
        title: '订单评价'
      }
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 订单系统` : '订单系统'
  next()
})

export default router 